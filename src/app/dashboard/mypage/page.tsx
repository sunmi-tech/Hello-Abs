'use client'

import { supabase } from "@/lib/superbaseClient";
import { useEffect, useState } from "react";

type UserData = {
    id: string,
    name: string,
    email: string,
    nickname: string,
    target_weight: number,
    start_date: string,
}

export default function MyPage(){
    const [userData, setUserData] = useState<UserData | null>(null);
    const [editUserData, setEditUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            console.log('getUser: ', user)

            if(!user) {
                console.log("사용자 정보를 찾을 수 없습니다.")
                return;
            } 

            const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            // WHERE 조건문이랑 동일함
            .single()

            if(error) {
                console.log("데이터 가져오기 실패 :", error)
                return;
            }
            setUserData(data);
            setEditUserData(data);
        }
        fetchUserData();
    }, []);

    // 마이페이지 수정 함수
    const handleEdit = async () => {
        if(!editUserData) {
            console.log("수정할 데이터가 없습니다.")
            return;
        }

        const { data, error } = await supabase
        .from("users")
        .update(editUserData)
        .eq("id", userData?.id)
        .select()
        .single()

        if(error) {
            console.log("데이터 수정 실패 :", error)
            return;
        }
    }
    
    
    return (
        <div>
            <h1>마이페이지</h1>
            <div>
                <h2>기본 정보</h2>
                <p>이름 : {userData?.name}</p>
                <p>이메일 : {userData?.email}</p>
                <p>닉네임 : {userData?.nickname}</p>
                <input 
                    value={editUserData?.nickname || ""}
                    onChange={(e) => setEditUserData({...editUserData, nickname: e.target.value})}
                    className="border-2"
                    type="text" 
                />
            </div>
            <div>
                <h2>다이어트 정보</h2>
                <p>목표 체중 : {userData?.target_weight}</p>
                <input 
                    value={editUserData?.target_weight || ""}
                    onChange={(e) => setEditUserData({...editUserData, target_weight: Number(e.target.value)})}
                    className="border-2"
                    type="number" />
                <p>다이어트 시작일 : {userData?.start_date}</p>
                <input 
                    value={editUserData?.start_date || ""}
                    onChange={(e) => setEditUserData({...editUserData, start_date: e.target.value})}
                    className="border-2"
                    type="date" />
            </div>
            <button onClick={handleEdit} className="cursor-pointer">수정</button>
        </div>
    )
}