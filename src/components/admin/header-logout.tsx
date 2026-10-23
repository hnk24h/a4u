"use client";

import {useState} from "react";

export function HeaderLogout(){
  const [busy,setBusy]=useState(false);
  async function logout(){
    if(busy)return;
    setBusy(true);
    try{await fetch("/api/admin/logout",{method:"POST"})}finally{window.location.assign("/admin/login")}
  }
  return <button className="admin-header-logout" type="button" onClick={logout} disabled={busy}>{busy?"Đang thoát…":"Đăng xuất"}</button>;
}
