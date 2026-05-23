export function kirimWhatsApp(text){

  const url =
    "https://wa.me/?text=" +
    encodeURIComponent(text);

  window.open(url,"_blank");
}
