let all =[];
let counter = 0;

async function download(){
    const inputWhere = document.getElementById('whereSpend');
    const inputHowMuch = document.getElementById('howMuchSpend');
    inputWhere.addEventListener("change", updateValueWhere);
    inputHowMuch.addEventListener("change", updateValueHowMuch);

    const resp = await fetch('http://localhost:3012/all',
        {method: 'GET'});
    let result = await resp.json();
    console.log(Object.values(result));
    Object.values(result).forEach(item =>{
        all.push(item);
        counter +=item.howMuch;
    })
    console.log(all);
    render();
}

let valueWhere = '';
updateValueWhere = (event) =>{
    valueWhere = event.target.value;//добавление задачи
}

let valueHowMuch = '';
updateValueHowMuch = (event) => {
    valueHowMuch = event.target.value;//добавление задачи
}

onClickButton = async () =>{
    if (typeof valueHowMuch == "number"){
        all.push({
            where : valueWhere,
            when : new Date().toJSON().slice(0,10).replace(/-/g,'/'),
            howMuch : valueHowMuch
        });
    }
    const resp = await fetch('http://localhost:3012/create', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            where: valueWhere,
            howMuch: valueHowMuch
        })
    });
    console.log(all);
    const inputWhere = document.getElementById('whereSpend');
    const inputHowMuch = document.getElementById('howMuchSpend');
    inputWhere.value = '';//обнуление ввода
    inputHowMuch.value = '';
    render();
}
//добавлениие
createExpense = ((item, index) =>{
    return `
    <div class="item">
    <div class="left">
        <div class="index">${index+1})</div>
            <div class="where"><span>Магазин </span>${item.where}</div>
            <div class="when">${item.when}</div>
        </div>
        
        <div class="right">
            <div class="howMuch">${item.howMuch}<span>р</span></div>
            <div class="buttons">
                <div class="btp-delete" onclick="onClickDelete(${index})"><img src="close.svg" height="15px" width="15px"></div>
                <div class="btn-update" onclick="onClickEdit(${index})"><img src="edit.svg" height="15px" width="15px"></div>
            </div>
        </div>
        
    </div>
    `
})



//редактирование



onClickEdit = (index) =>{

    const content = document.querySelector('.edit');
    const inputEditWhere = document.createElement('input');
    inputEditWhere.addEventListener("change", updateValueEditWhere);
    inputEditWhere.type = 'text';
    inputEditWhere.id = '1';
    inputEditWhere.required;
    const inputEditHowMuch = document.createElement('input');
    inputEditHowMuch.addEventListener("change", updateValueEditHowMuch);
    inputEditHowMuch.type = 'text'
    inputEditHowMuch.id = '2';
    const done = document.createElement('h1');
    done.innerText = '✓';
    done.id = 'done';

    done.addEventListener('click', onClickDoneEdit(index));
    inputEditWhere.type = 'text';
    const text = document.createElement('h1');
    text.type = 'text';
    text.id = 'redact';
    text.innerText = 'Редактирование';
    content.appendChild(text);
    content.appendChild(inputEditWhere);
    content.appendChild(inputEditHowMuch);
    content.appendChild(done);

}



onClickDoneEdit = async (index) => {




    console.log(1)
    console.log(valueEditWhere);
    console.log(valueEditHowMuch);
    //if ((typeof valueEditWhere == "String") &(typeof valueEditHowMuch == "String")){
        console.log(2)
        const resp = await fetch(`http://localhost:3012/update/${all[index]._id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                where: valueEditWhere,
                howMuch: valueEditHowMuch
            })
        });
        counter= counter - all[index].howMuch;
        const  count = document.querySelector('.count');
        count.innerHTML = counter;
        all[index].where = valueEditWhere;
        all[index].howMuch = valueEditHowMuch;
        render();
        let result = await resp.json();
        console.log(result);
        const content = document.querySelector('.edit');
        const text = document.getElementById('redact');
        const inputEditWhere =document.getElementById('1');
        const inputEditHowMuch = document.getElementById('2');
        const done = document.getElementById('done');
        content.removeChild(text);
        content.removeChild(inputEditWhere);
        content.removeChild(inputEditHowMuch);
        content.removeChild(done);
    //}

}

let valueEditWhere = "";
updateValueEditWhere = (event) =>{
    console.log(9)
    valueEditWhere = event.target.value;//чтение из поля редактирования
}

let valueEditHowMuch = "";
updateValueEditHowMuch = (event) => {
    console.log(8)
    valueEditHowMuch = event.target.value;//чтение из поля редактирования
}

//Удаление
onClickDelete = async (index) => {

    const resp = await fetch( `http://localhost:3012/delete/${all[index]._id}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*'
        }
    });
    counter= counter - all[index].howMuch;
    const  count = document.querySelector('.count');
    count.innerHTML = counter;

    all.splice(index, 1);
    render();

    let result = await resp.json();
    console.log(result);

}



render = () =>{
    const content = document.querySelector('.items');
    while (content.firstChild){
        content.removeChild(content.firstChild);
    }//очищаем контент каждый раз от записанного элемента
    content.innerHTML ='';
    if (all.length!==0){
        all.forEach((item, index) =>{
            content.innerHTML += createExpense(item, index);
        })
    }
    const  count = document.querySelector('.count');
    count.innerHTML = counter;
}
