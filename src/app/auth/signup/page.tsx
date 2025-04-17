"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/superbaseClient";

const data = [
  {
    label: "이메일",
    type: "email",
    id: "email",
    placeholder: "이메일을 입력해주세요.",
    required: true,
  },
  {
    label: "비밀번호",
    type: "password",
    id: "password",
    placeholder: "비밀번호를 입력해주세요.",
    required: true,
  },
  {
    label: "비밀번호 확인",
    type: "password",
    id: "confirmPassword",
    placeholder: "비밀번호를 입력해주세요.",
    required: true,
  },
  {
    label: "닉네임",
    type: "text",
    id: "nickname",
    placeholder: "닉네임을 입력해주세요.",
    required: true,
  },
  {
    label: "현재체중",
    type: "number",
    id: "currentWeight",
    placeholder: "kg",
    required: false,
  },
  {
    label: "목표체중",
    type: "number",
    id: "targetWeight",
    placeholder: "kg",
    required: false,
  },
  {
    label: "다이어트 시작일",
    type: "date",
    id: "startDate",
    required: false,
  },
];

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formValues = new FormData(e.target as HTMLFormElement);

    const email = formValues.get("email")?.toString();
    const password = formValues.get("password")?.toString();
    const confirmPassword = formValues.get("confirmPassword")?.toString();
    const nickname = formValues.get("nickname")?.toString();
    const currentWeight = formValues.get("currentWeight")?.toString();
    const targetWeight = formValues.get("targetWeight")?.toString();
    const startDate = formValues.get("startDate")?.toString();

    if (!email || !password || !confirmPassword || !nickname) {
      alert("모든 필수 입력 항목을 써주세요.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // 회원가입 시도
      const { data, error } = await supabase.auth.signUp({
        email: email!,
        password: password!,
      });

      if (error) {
        alert("회원가입 실패");
        console.error(error);
        return;
      }

      await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      const { data: userData } = await supabase.auth.getUser();
      
      const userId = userData.user?.id;
      
      if (!userId) {
        alert("로그인 상태가 아닙니다.");
        return;
      }
      
      console.log("확실한 userId:", userId);
      
      // insert
      await supabase.from("users").insert({
        id: userId,
        email,
        nickname,
        current_weight: currentWeight,
        target_weight: targetWeight,
        start_date: startDate,
      });

      alert("회원가입 성공!");
      router.push("/");
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
      alert("회원가입 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md p-8 bg-white rounded-x1"
      >
        {/* 필수입력 */}
        <h2 className="text-2xl font-bold mb-8 text-center text-secondary">
          회원가입
        </h2>
        <div className="flex flex-col gap-4">
          {data.map((item) => {
            return (
              <div key={item.id}>
                <label htmlFor={item.id}>{item.label}</label>
                <input
                  className="block w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder={item.placeholder}
                  type={item.type}
                  id={item.id}
                  name={item.id}
                  required={item.required}
                />
              </div>
            );
          })}
        </div>
        <button
          type="submit"
          className="w-full mt-6 bg-secondary text-white py-2 rounded-md hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          회원가입
        </button>
      </form>
    </div>
  );
}
