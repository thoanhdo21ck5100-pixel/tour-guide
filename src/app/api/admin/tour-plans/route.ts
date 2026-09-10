import { NextRequest, NextResponse } from 'next/server';
import {
  getAllCustomTourPlansAdmin,
  upsertCustomTourPlan,
  deleteCustomTourPlan,
} from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const plans = await getAllCustomTourPlansAdmin();
    return NextResponse.json({ success: true, plans });
  } catch (error) {
    console.error('Error fetching admin custom tour plans:', error);
    return NextResponse.json(
      { error: 'ツアープラン一覧の取得に失敗しました。' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, tourTitle, tourDate } = body;

    if (!customerName || !customerEmail || !tourTitle || !tourDate) {
      return NextResponse.json(
        { error: 'お客様名、メールアドレス、ツアー名、日程は必須項目です。' },
        { status: 400 }
      );
    }

    const result = await upsertCustomTourPlan(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || '保存に失敗しました。' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'ツアープランを正常に保存しました。',
    });
  } catch (error) {
    console.error('Error saving custom tour plan:', error);
    return NextResponse.json(
      { error: 'ツアープランの保存中にエラーが発生しました。' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ error: '削除するIDを指定してください。' }, { status: 400 });
    }

    const success = await deleteCustomTourPlan(id);
    return NextResponse.json({ success, message: 'ツアープランを削除しました。' });
  } catch (error) {
    console.error('Error deleting custom tour plan:', error);
    return NextResponse.json(
      { error: 'ツアープランの削除中にエラーが発生しました。' },
      { status: 500 }
    );
  }
}
