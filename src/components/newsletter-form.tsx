"use client";
import {useState} from "react";
import type {Locale} from "@/lib/i18n";

const copy:Record<Locale,{email:string;submit:string;success:string;error:string;already:string}>={
  vi:{email:"Email nhận thông báo",submit:"Đăng ký",success:"Đăng ký thành công. Hãy kiểm tra hộp thư.",error:"Chưa thể đăng ký. Vui lòng thử lại.",already:"Email này đã đăng ký nhận tin."},
  en:{email:"Email for alerts",submit:"Subscribe",success:"Subscribed. Please check your inbox.",error:"Could not subscribe. Please try again.",already:"This email is already subscribed."},
  ja:{email:"通知を受け取るメール",submit:"登録",success:"登録しました。受信箱をご確認ください。",error:"登録できませんでした。もう一度お試しください。",already:"このメールアドレスは登録済みです。"},
  ko:{email:"알림 받을 이메일",submit:"구독",success:"신청이 완료되었습니다. 받은 편지함을 확인하세요.",error:"신청하지 못했습니다. 다시 시도해 주세요.",already:"이미 등록된 이메일입니다."},
};

export function NewsletterForm({locale}:{locale:Locale}){
  const t=copy[locale];
  const [status,setStatus]=useState("");
  const [busy,setBusy]=useState(false);
  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();setBusy(true);setStatus("");
    const form=event.currentTarget,data=new FormData(form);
    try{
      const response=await fetch("/api/newsletter",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:data.get("email"),locale,consent:true})});
      const result=await response.json();
      setStatus(response.ok?(result.already?t.already:t.success):t.error);
      if(response.ok)form.reset();
    }catch{setStatus(t.error)}finally{setBusy(false)}
  }
  return <div className="newsletter-inline">
    <form onSubmit={submit}>
      <input className="email" name="email" type="email" required maxLength={320} placeholder={t.email} aria-label={t.email}/>
      <button className="newsletter-submit" type="submit" disabled={busy} aria-label={t.submit} title={t.submit}>{busy?"…":t.submit}</button>
    </form>
    {status&&<span className="newsletter-inline-status" role="status">{status}</span>}
  </div>;
}
