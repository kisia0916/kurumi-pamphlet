import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => null)
        if (!body || typeof body !== 'object') {
            return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
        }

        const { title,content, link, status } = body as {
            title?: unknown
            content?: unknown
            link?: unknown
            status?: unknown
        }

        if (typeof title !== 'string' || typeof content !== 'string') {
            return NextResponse.json({ error: 'invalid_fields' }, { status: 400 })
        }

        const safeLink = link == null ? undefined : (typeof link === 'string' ? link : undefined)

        const validStatuses = ['ALL', 'PART'] as const
        const safeStatus = typeof status === 'string' && validStatuses.includes(status as any)
          ? (status as typeof validStatuses[number])
          : undefined
        if (!safeStatus) {
            return NextResponse.json({ error: 'invalid_status' }, { status: 400 })
        }

        const create_data = await prisma.notifications.create({
            data: {
                title,
                content,
                link: safeLink,
                status: safeStatus,
            },
        })
        return NextResponse.json({ success: true, data: create_data }, { status: 200 })
    } catch (e) {
        console.error('register_user_stamp POST error', e)
        return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }
}