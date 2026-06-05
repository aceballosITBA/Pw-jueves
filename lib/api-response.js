import { NextResponse } from 'next/server';

export function successResponse(data, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message, status = 400, code = null) {
  const body = { success: false, error: message };
  if (code) body.code = code;
  return NextResponse.json(body, { status });
}
