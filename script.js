import { produk, extra, minuman } from "./data.js";
import { simpanData, ambilData } from "./storage.js";
import { kirimWhatsApp } from "./wa.js";

const tanggal = document.getElementById("tanggal");

tanggal.valueAsDate = new Date();

function rupiah(nominal){
  return "Rp " + Number(nominal).toLocaleString("id-ID");
}

function buatTabel(id,data,prefix){

  const tbody =
    document.querySelector(`#${id} tbody`);

  tbody.innerHTML = "";

  data.forEach((item,index)=>{

    tbody.innerHTML += `
      <tr>
        <td class="left">${item.nama}</td>

        <td>${rupiah(item.harga)}</td>

        <td>
          <input
            type="number"
            min="0"
            value="0"
            id="${prefix}_${index}"
          >
        </td>

        <td id="total_${prefix}_${index}">
          Rp 0
        </td>
      </tr>
    `;
  });
}

buatTabel("tabelProduk",produk,"produk");
buatTabel("tabelExtra",extra,"extra");
buatTabel("tabelMinuman",minuman,"minuman");

document.addEventListener("input",hitung);

function hitung(){

  let grandTotal = 0;

  grandTotal += hitungBagian(produk,"produk");
  grandTotal += hitungBagian(extra,"extra");
  grandTotal += hitungBagian(minuman,"minuman");

  document.getElementById("grandTotal")
    .innerText = rupiah(grandTotal);
}

function hitungBagian(data,prefix){

  let total = 0;

  data.forEach((item,index)=>{

    const jumlah =
      Number(
        document.getElementById(`${prefix}_${index}`).value
      );

    const subtotal =
      jumlah * item.harga;

    total += subtotal;

    document.getElementById(
      `total_${prefix}_${index}`
    ).innerText = rupiah(subtotal);

  });

  return total;
}

window.simpan = function(){

  const data = {
    tanggal: tanggal.value,
    catatan:
      document.getElementById("catatan").value,
  };

  simpanData(
    "laporan_" + tanggal.value,
    data
  );

  alert("Data berhasil disimpan");
};

window.kirimWA = function(){

  let text =
`*LAPORAN PENJUALAN*

Tanggal: ${tanggal.value}

`;

  text += buatText(produk,"produk");
  text += buatText(extra,"extra");
  text += buatText(minuman,"minuman");

  text += `
Total:
${document.getElementById("grandTotal").innerText}
`;

  kirimWhatsApp(text);
};

function buatText(data,prefix){

  let hasil = "";

  data.forEach((item,index)=>{

    const jumlah =
      Number(
        document.getElementById(`${prefix}_${index}`).value
      );

    if(jumlah > 0){

      hasil +=
`${item.nama} x${jumlah}
`;
    }

  });

  return hasil + "\n";
}

hitung();
