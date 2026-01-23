const target_tauri = false

//export const api_proxy_addr = "http://192.168.31.164:8080"
//export const img_proxy_addr = "http://192.168.31.164:9000"
export const api_proxy_addr = "https://10.205.157.61:8080";
export const img_proxy_addr = "https://10.205.157.61:9000";
export const dest_api = (target_tauri) ? api_proxy_addr : "/api"
export const dest_img =  (target_tauri) ?  img_proxy_addr : "/img-proxy"
//export const dest_root = (target_tauri) ? "" : "/FrontendRIPBackeven/"
export const dest_root = "/FrontendRIPBackeven/";
