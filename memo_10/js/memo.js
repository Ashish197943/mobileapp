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
  save.addEventListener("click",
    function (e) {
      e.preventDefault();

      const key = document.getElementById("textKey").value;
      const value = document.getElementById("textMemo").value;

      if (key === "" || value === "") {
        Swal.fire({
          title: "Memo app"
          , html: "KeyとMemoはいずれも必須です。"
          , type: "error"
          , allowOutsideClick: false
        });
        return;
      } else {
        let w_msg = "LocalStorageに[" + key + "] [" + value + "]を保存しますか?";
        Swal.fire({
          title: "Memo app"
          , html: w_msg
          , type: "question"
          , showCancelButton: true
        }).then(function (result) {
          if (result.value === true) {
            localStorage.setItem(key, value);
            viewStorage();
            let w_msg = "LocalStorageに[" + key + "][ " + value + "]を保存しました。";
            Swal.fire({
              title: "Memo app"
              , html: w_msg
              , type: "success"
              , allowOutsideClick: false
            });

            // 入力欄クリア
            document.getElementById("textKey").value = "";
            document.getElementById("textMemo").value = "";
          }
        });
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
      Swal.fire({
        title: "Error"
        , html: "1つ選択してください。"
        , type: "error"
        , allowOutsideClick: false
      });
    }
  } if (mode === "del") {
    if (w_cnt >= 1) {
      return w_cnt;
    } else {
      Swal.fire({
        title: "Error"
        , html: "1つ以上選択 してください。"
        , type: "error"
        , allowOutsideClick: false
      });
    }
  }
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
    let td4 = document.createElement("td");

    // HTMLのlistタグの中にtrタグを追加（G）
    list.appendChild(tr);
    // trタグの中にtdタグを追加（H）
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);

    // tdタグの定義
    td1.innerHTML = "<input name='chkbox1' type='checkBox'>";
    td2.innerHTML = w_key;
    td3.innerHTML = localStorage.getItem(w_key);
    td4.innerHTML = "<img src='img/trash_icon.png' class = 'trash'>";
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
      const chkbox1 = document.getElementsByName("chkbox1");
      const table1 = document.getElementById("table1");
      let w_cnt = "0";
      w_cnt = selectCheckBox("del");
      if (w_cnt >= "1") {
        Swal.fire({
          title: "Memo app"
          , html: "LocalStorageから選択されている [" + w_cnt + "] 件を削除しますか?"
          , type: "question"
          , showCancelButton: true
        }).then(function (result) {
          if (result.value === true) {
            for (let i = 0; i < chkbox1.length; i++) {
              if (chkbox1[i].checked) {
                localStorage.removeItem(table1.rows[i + 1].cells[1].firstChild.data);
              }
            }
            viewStorage();
            let w_msg = "LocalStorageから [ " + w_cnt + "] 件を削除しました";
            Swal.fire({
              title: "Memo app"
              , html: w_msg
              , type: "success"
              , allowOutsideClick: false
            });
            document.getElementById("textKey").value = "";
            document.getElementById("textMemo").value = "";
          }
        });
      }
    }, false
  );
  const table1 = document.getElementById("table1");
  table1.addEventListener("click",
    (e) => {
      if (e.target.classList.contains("trash") === true) {
        let index = e.target.parentNode.parentNode.rowIndex;
        const key = table1.rows[index].cells[1].firstChild.data;
        const value = table1.rows[index].cells[2].firstChild.data;
        let w_delete = "LocalStorageから\n " + key + value + " \nを削除しますか？";
        Swal.fire({
          title: "Memo app",
          html: w_delete,
          type: "question",
          showCancelButton: true
        }).then(result => {
          if (result.value === true) {
            localStorage.removeItem(key);
            viewStorage();
            let w_msg = "LocalStorageから " + key + value + " を削除しました!";
            Swal.fire({
              title: "Memo app",
              html: w_msg,
              type: "success",
              allowOutsideClick: false
            });
            document.getElementById("textKey").value = "";
            document.getElementById("textMemo").value = "";
          }
        })
      }
    });
};

function allClearLocalStorage() {
  const allClear = document.getElementById("allClear");
  allClear.addEventListener("click",
    function (e) {
      e.preventDefault();
      Swal.fire({
        title: "Memo app"
        , html: "LocalStorageのデータをすべて削除します。\nよろしいですか?"
        , type: "question"
        , showCancelButton: true
      }).then(function (result) {
        if (result.value === true) {
          localStorage.clear();
          viewStorage();
          let w_msg = "このページの内容 LocalStorageのデータをすべて削除しました。";
          Swal.fire({
            title: "Memo app"
            , html: w_msg
            , type: "success"
            , allowOutsideClick: false
          });
          document.getElementById("textKey").value = "";
          document.getElementById("textMemo").value = "";
        }
      });
    }, false
  );
};
