/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

// ./apiUtils.ts
import { NextResponse } from 'next/server';
export const formatResponse = (data: string | object, message: string, status: number) => {
  const ok = status >= 200 && status < 300;
  return NextResponse.json({ ok, data, message, status_code: status }, { status });
};
