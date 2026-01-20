"use strict"

window.addEventListener("DOMContentLoaded",
  function () {
    if (typeof localStorage === "undefined") {
      window.alert("このブラウザはlocal storage機能が実装されていません");
      return;
    } else {
      viewStorage();
      saveLocalStorage();
      delLocalStorage();
      selectable();
      allClearLocalStorage();

    }
  }, false
);

function saveLocalStorage() {
  const save = document.getElementById("save");
  save.addEventListener("click", function (e) {
    e.preventDefault();

    const key = document.getElementById("textKey").value;
    const value = document.getElementById("textMemo").value;

    if (key === "" || value === "") {
      window.alert("Key、Memoはいずれも必須です。");
      return;
    } else {
      let w_confirm = window.confirm("LocalStorageに[" + key + "] [" + value + "]を保存しますか?");
      if(w_confirm === true){
      localStorage.setItem(key, value);
      viewStorage();

      let w_msg = "LocalStorageに「" + key + "」と「" + value + "」を保存しました。";
      window.alert(w_msg);

      // 入力欄クリア
      document.getElementById("textKey").value = "";
      document.getElementById("textMemo").value = "";
      }
    }
  }, false
  );
};

function selectable() {
  const select = document.getElementById("select");
  select.addEventListener("click",
    function (e) {
      e.preventDefault();
      selectCheckBox("select");
    }, false
  );
}

function selectCheckBox(mode) {
  let w_cnt = 0;
  const chkbox1 = document.getElementsByName("chkbox1");
  const table1 = document.getElementById("table1");
  let w_textKey = "";
  let w_textMemo = "";

  for (let i = 0; i < chkbox1.length; i++) {
      if (chkbox1[i].checked) {
          if (w_cnt === 0) {
              w_textKey = table1.rows[i + 1].cells[1].firstChild.data;
              w_textMemo = table1.rows[i + 1].cells[2].firstChild.data;
          }
          w_cnt++;
      }
  }
  document.getElementById("textKey").value = w_textKey;
  document.getElementById("textMemo").value = w_textMemo;

  if (mode === "select") {
      if (w_cnt === 1) {
          return w_cnt;
      } else {
          window.alert("1つ選択してください。");
      }
  } if (mode === "del") {
      if (w_cnt >= 1) {
          return w_cnt;
      } else {
          window.alert("1つ選択してください。");
      }
  }
  return 0;
}


// localStorageからのデータの取得とテーブル表示
function viewStorage() {
  // 定義の宣言：list（B）
  const list = document.getElementById("list");

  // htmlのテーブル初期化
  while (list.rows[0]) list.deleteRow(0);

  // localStorageすべての情報の取得（C）
  for (let i = 0; i < localStorage.length; i++) {
    // localStorageの読み取り（D）
    let w_key = localStorage.key(i);

    // localStorageのキーと値を表示（E〜H）
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");

    // HTMLのlistタグの中にtrタグを追加（G）
    list.appendChild(tr);
    // trタグの中にtdタグを追加（H）
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);

    // tdタグの定義
    td1.innerHTML = "<input name='chkbox1' type='checkBox'>";
    td2.innerHTML = w_key;
    td3.innerHTML = localStorage.getItem(w_key);
  }
  $("#table1").tablesorter({
    sortList: [[1, 0]]
  });
  $("#table1").trigger("update");
}

// 削除機能
function delLocalStorage() {
  const del = document.getElementById("delete");
  del.addEventListener("click",
    function (e) {
      e.preventDefault();

      const chkbox1 = document.getElementById("chkbox1");
      const table1 = document.getElementById("table1");
      let w_cnt = "0";
      w_cnt =selectCheckBox("del");

      if(w_cnt >= "1"){
        let w_confirm = window.confirm("LocalStorageから選択されている [ " + w_cnt + " ] 件を削除しますか?");
        if(w_confirm === true){
          for(let i = 0;i < chkbox1.length;i++){
          if(chkbox1[i].checked){
            localStorage.removeItem(table1.rows[i + 1].cells[1].firstChild.data);
          }
          }
        
        viewStorage();

        let w_msg = "LocalStorageから" + w_cnt + " 削除しました。";
        window.alert(w_msg);

        document.getElementById("textKey").value = "";
        document.getElementById("textMemo").value = "";
        }
    }
    }, false
  );
}

function allClearLocalStorage(){
  const allClear = document.getElementById("allClear");
  allClear.addEventListener("click",
  function(e){
    e.preventDefault();
    let w_comfirm = confirm("LocalStorageのデータを全て削除します。\nよろしいでしょうか?");
    if(w_comfirm === true){
      localStorage.clear();
      viewStorage();
      let w_msg = "LocalStorageのデータを全て削除しました。";
      window.alert(w_msg);
      document.getElementById("textKey").value = "";
      document.getElementById("textMemo").value = "";
    }
  },false
  );
};

