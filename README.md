# edit-code-to-success

#step code
 - copy code in floder constant.ts +server.ts db.ts
 - next step run code

#step run
 - pnpm build
 - node ./build
 - pnpm cypress install (ถ้ายังไม่ได้ติดตั้ง) ** ถ้าลงแล้วให้ข้ามไปเลย **
 - pnpm cypress open
 - ให้คลิกเลือก E2E Testing
 - ให้เลือก Edge แล้วกด start
 - กดคลิกที่ spec.cy.ts แล้วรอถ้าจนกว่าจะทำงานเสร็จถ้าขึ้นเขียวแสดงว่าผ่านหมด
#
อย่าลืมเปิด Xampp ก่อนจะทำและสร้างฐานข้อมูลให้เสร็จ พร้อมจัดการ node js และเชื่อมฐานข้อมูลให้เรียบร้อยใน file .env !!!!
ติดปัญหาอะไรให้ทักแชทมาถาม good luck :)
