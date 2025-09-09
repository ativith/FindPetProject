import { StreamChat } from "npm:stream-chat";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

console.log("Hello from Functions!");

Deno.serve(async (req) => {
  const authHeader = req.headers.get("Authorization")!;
  //สร้าง Supabase client สำหรับเรียก API บน server
  const supabaseClient = createClient(
    Deno.env.get("PROJECT_URL") ?? "",
    Deno.env.get("PROJECT_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authHeader } } },
  );//authheader = jwt token ที่เเนบมากับreq

  // Get the session or user object
  const authToken = authHeader.replace("Bearer ", ""); //เอาคำว่าBearerออก เหลือเเต่token
  const { data } = await supabaseClient.auth.getUser(authToken);//นำ token ไปเช็ค  กับ supabase
  const user = data.user;
  if (!user) {
    return new Response(
      JSON.stringify({ error: "User not found" }),
      { headers: { "Content-Type": "application/json" } },
    );
  }

  const serverClient = StreamChat.getInstance(
    Deno.env.get("STREAM_API_KEY"),
    Deno.env.get("STREAM_API_SECRET"),
  );

  const token = serverClient.createToken(user.id);

  return new Response(
    JSON.stringify({ token }),
    { headers: { "Content-Type": "application/json" } },
  );
});
/*edge functionของ supabase ทำหน้าที่เหมือนเป็น server หรือ http endpoint 
ถ้าไม่ใช้ supabase จะไปนั่งเขียน express เองก็ได้ เเต่ต้องมีserver ของตัวเอง ไม่ก็ไปเช่า aws เเละต้องดูเเลระบบ ความปลอดภัยเองไรงี้ ซึ่งลำบาก */

/* streamchat secret key หรือพวก secret key อื่นๆ ห้ามเก็ยในfrontend เด็ดขาด ถึงจะเก็บไว้ใน env ก็ตาม เพราะ
Build process จะ bundle ค่าใน .env เข้าไปใน JavaScript ที่รันใน browser หรือ app นอื่นสามารถดูค่าได้จาก source code / bundle / devtools
ดังนั้นควรเก็บไว้ใน .env backend เพราะ Server / Edge Function รันบน server ของคุณ */

