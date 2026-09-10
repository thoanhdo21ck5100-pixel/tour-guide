import { NextRequest, NextResponse } from 'next/server';
import { getCustomTourPlanByCodeAndEmail } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tourCode, email } = body;

    if (!tourCode || typeof tourCode !== 'string' || tourCode.trim().length === 0) {
      return NextResponse.json(
        { error: 'ツアー管理番号（JPVN-XXXX）を入力してください。' },
        { status: 400 }
      );
    }

    const identifier = (body.email || body.identifier || '').trim();

    if (!identifier || typeof identifier !== 'string' || identifier.length < 2) {
      return NextResponse.json(
        { error: 'お申し込み時のメールアドレス、LINE ID または お電話番号を入力してください。' },
        { status: 400 }
      );
    }

    const plan = await getCustomTourPlanByCodeAndEmail(tourCode, identifier);

    if (!plan) {
      return NextResponse.json(
        {
          error:
            '該当するツアープランが見つかりませんでした。ツアー管理番号（JPVN-XXXX）とお申し込み時のメールアドレスまたはLINE ID・お電話番号が正しく一致しているかご確認ください。',
        },
        { status: 404 }
      );
    }

    // 7-day Photo Expiration Check
    const nowMs = Date.now();
    const isExpired = Boolean(
      plan.photoStatus === 'expired' ||
      (plan.photosExpireAt && new Date(plan.photosExpireAt).getTime() <= nowMs)
    );

    // If expired, ensure driveUrl is withheld from the response so it cannot be accessed
    const sanitizedPlan = {
      ...plan,
      photoStatus: isExpired ? 'expired' : plan.photoStatus,
      driveUrl: isExpired ? '' : plan.driveUrl,
    };

    return NextResponse.json({
      success: true,
      plan: sanitizedPlan,
      isPhotoExpired: isExpired,
    });
  } catch (error) {
    console.error('Error during tour plan lookup:', error);
    return NextResponse.json(
      { error: '照会処理中にエラーが発生しました。時間をおいて再度お試しください。' },
      { status: 500 }
    );
  }
}
