# code +server

import { getUserByMiddleware } from "$lib/middleware/user";
import { json } from "@sveltejs/kit";
import { RequestEvent } from "./$types";
import { handlerError } from "$lib/handler/error.handler";
import { conn } from "$lib/db";
import { checkoutByBasketSchema } from "$lib/schema/order.schema";
import constant from "$lib/constant";
import { v7 } from "uuid";
import { ICheckoutByBasketId } from "$lib/interface/order.interface";

export async function POST({ cookies, request }: RequestEvent) {
    try {
        // Get user
        const user = await getUserByMiddleware(cookies, false);
        if (!user) return
        // Body
        const body = await checkoutByBasketSchema.parseAsync(await request.json())
        const basketMapping = new Map(body.baskets.map((i) => [i.basket_id, i.unit]))
        // Basket
        const [baskets] = await conn.query<ICheckoutByBasketId>(constant.getBaskets, [user.id])
        if (baskets.length !== body.baskets.length) return json({
            message: "Violation detected"
        }, { status: 403 })
        // Check address
        const [address] = await conn.query(constant.getAddressSubDistrictById, [body.info.address_id])
        if (address.length === 0) return json({
            message: "Address not exist."
        }, { status: 404 })

        // Start transaction
        await conn.beginTransaction()
        try {
            // Create order (TODO: must be execute)
            const [orderResult] = await conn.execute(constant.createCheckout, [v7(), user.id])
            console.log(orderResult)
            const orderId = orderResult.insertId
            // Create shipping
            const { name, address, address_id, mobile } = body.info
            await conn.execute(constant.createShipping, [orderId, name, address, address_id, mobile])
            for (const basket of baskets) {
                const unitsCurrent = basketMapping.get(basket.id)!
                const remaining = basket.stocks - unitsCurrent
                if (remaining < 0) {
                    throw new Error(`สินค้า "${basket.title}" หมดสต็อก กรุณาลองใหม่อีกครั้งภายหลัง`)
                }
                // Decrease product
                await conn.execute(constant.updateProductUnitById, [remaining, basket.product_id])
                // Insert order items
                await conn.execute(constant.createCheckoutItems, [orderId, basket.product_id, basket.price, unitsCurrent])
            }
            // Then delete all by user id
            await conn.execute(constant.deleteBasketByUserId, [user.id])
            // Execute transaction
            await conn.commit()
        } catch (e) {
            console.error(e)
            if (e instanceof Error) {
                return json({
                    message: e.message
                }, { status: 500 })
            }
            await conn.rollback()
            return json({
                message: "Somemthing went wrong. Please try again."
            })
        } finally {
            await conn.commit()
        }

        return json({}, { status: 201 })
    } catch (e) {
        return handlerError(e);
    }
}
