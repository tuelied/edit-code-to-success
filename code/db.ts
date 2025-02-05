#code db

import { DATABASE_HOST, DATABASE_NAME, DATABASE_PASS, DATABASE_USER } from '$env/static/private';
import type { Connection, ResultSetHeader } from 'mysql2/promise';
import mysql from 'mysql2/promise';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
interface IConnection extends Connection {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: <D>(sql: string, params?: any[]) => [D[], string[]]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute: (sql: string, params?: any[]) => ResultSetHeader[]
}

export const conn = await mysql.createConnection({
    host: DATABASE_HOST,
    user: DATABASE_USER,
    password: DATABASE_PASS,
    database: DATABASE_NAME
}) as unknown as IConnection;

