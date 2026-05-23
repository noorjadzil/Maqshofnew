export function simpanData(key,data){
  localStorage.setItem(key,JSON.stringify(data));
}

export function ambilData(key){
  return JSON.parse(localStorage.getItem(key));
}
