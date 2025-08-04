import { NextResponse } from "next/server";

export interface IResponse {
    data: unknown;
    message: string;
    status: number;
}
export const formatResponse = (data: unknown, message: string, status: number) => NextResponse.json({ data, message, status }, { status });