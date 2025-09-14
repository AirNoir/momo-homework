import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");
    const tag = searchParams.get("tag");

    // 驗證請求來源（在生產環境中，你可能需要更嚴格的驗證）
    const referer = request.headers.get("referer");
    if (!referer || !referer.includes(request.headers.get("host") || "")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (path) {
      // 重新驗證特定路径
      revalidatePath(path);
      console.log(`Revalidated path: ${path}`);

      return NextResponse.json({
        revalidated: true,
        path,
        message: `Successfully revalidated ${path}`,
        timestamp: new Date().toISOString(),
      });
    }

    if (tag) {
      // 重新驗證特定標籤
      revalidateTag(tag);
      console.log(`Revalidated tag: ${tag}`);

      return NextResponse.json({
        revalidated: true,
        tag,
        message: `Successfully revalidated tag ${tag}`,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        message: "Missing path or tag parameter",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      {
        message: "Error revalidating",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// 支援 GET 請求用於測試
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Revalidation API is working",
    usage: {
      POST: "/api/revalidate?path=/page/[id]",
      description: "Use POST method to revalidate specific paths or tags",
    },
  });
}
