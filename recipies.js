// document.addEventListener('DOMContentLoaded', function() {
//         var recipeName = document.getElementById("recipe_table").querySelector(".news-item #recipeName").textContent;
//         var recipeIngredients = document.getElementById("ingredients") || document.getElementsByClassName("recipe_full");
//         console.log(recipeName);
        
//     let db = indexedDB.open("db",1);
    
//     db.onsuccess = function(event) {
//         var tables = db.result;
//         var transaction = tables.transaction(["reciepes"], "readwrite");
//         let objectstore = transaction.objectStore("reciepes");
        
//             var recipe = {id: 1, name: recipeName /*, ingredients: recipeIngredients */};
//             var adding = objectstore.add(recipe);
            
//             adding.onsuccess = function(event) {
//                 console.log("Рецепт успешно добавлен в хранилище данных");
//             };
        
        
//         transaction.oncomplete = function(event) {
//             console.log("Транзакция завершена");
//             db.close();
//         };
//     };
    
//     db.onupgradeneeded = function(event) {
//         var tables = db.result;
//         var reciepe = tables.createObjectStore("reciepes", {keyPath: "id"});
//     };
// });

/*получение данных из формы, для сохранения 1ого объекта в LS
далее при нажатии на кнопку этот элемент будет добавлятся в список*/
const LS = localStorage;

function getCurrentDateTime() {
    var currentDateTime = new Date();
  
    var year = currentDateTime.getFullYear();
    var month = currentDateTime.getMonth() + 1;
    var day = currentDateTime.getDate();
    var hours = currentDateTime.getHours();
    var minutes = currentDateTime.getMinutes();
    var seconds = currentDateTime.getSeconds();
  
    // Дополнительные проверки и добавление ведущих нулей при необходимости
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
  
    var formattedDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    return formattedDateTime;
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('AddRecipe');

      let formData = {};
      //var data = JSON.parse(IDB.getItem('formData'))||[];


      const recipeIngredients = document.getElementById('recipeIngredients');
      const MyInput = document.getElementById('MyInput');
      const newsImgInput = document.getElementById('newsImgID');
      const descrptn = document.getElementById('description');
      const EditDateID = document.getElementById('EditDateID');
    
    var modal = document.getElementById("modal");
    var input1 = document.getElementById("input1");
    var input2 = document.getElementById("input2");
    var input3 = document.getElementById("input3");
    var input4 = document.getElementById("input4");
    var confirmBtn = document.getElementById("confirmBtn");
    var cancelBtn = document.getElementById("cancelBtn");

    var modalData = [];

    function openModal(newsToUpdate) {
        modal.style.display = "flex";
        input1.value=newsToUpdate.name;
        input2.value=newsToUpdate.newsImgName;
        input3.value=newsToUpdate.recipeIngredients;
        input4.value=newsToUpdate.descrptn;
    }

    function closeModal() {
        modal.style.display = "none";
    }
    
    function handleConfirm() {
        var value1 = input1.value;
        var value2 = input2.value;
        var value3 = input3.value;
        var value4 = input4.value;
        // Делайте что-то с введенными значениями...
        console.log("Название рецепта:", value1);
        console.log("Ссылка на изображение:", value2);
        console.log("Ингредиенты:", value3);
        console.log("Рецепт:", value4);

        modalData = [value1, value2, value3, value4]; 

        var storedNews = JSON.parse(LS.getItem('recipes')) || [];
        console.log("Индекс окна"+modal.dataset.index)
        var newsToUpdate = storedNews[modal.dataset.index];

        newsToUpdate.name = modalData[0];
        newsToUpdate.newsImgName = modalData[1];
        newsToUpdate.recipeIngredients = modalData[2];
        newsToUpdate.descrptn = modalData[3];
        newsToUpdate.editDate=getCurrentDateTime();

        modalData[0]="";
        modalData[1]="";
        modalData[2]="";
        modalData[3]="";

        // Обновите данные в Local Storage
        LS.setItem('recipes', JSON.stringify(storedNews));
        displayNews();  //Обновите отображение после изменения
        console.log("modalData", modalData);
        closeModal();
    }
    
    function handleCancel() {
        closeModal();
    }
    
    
    function updateNews(index) {
        // Получите элемент новости по индексу
        var storedNews = JSON.parse(LS.getItem('recipes')) || [];
        var newsToUpdate = storedNews[index];
      
        // Выполните необходимые действия для изменения элемента, например:
    
        console.log(index);
        modal.dataset.index = index;
        openModal(newsToUpdate);
        console.log("modalData ", modalData);
        // Обновите элемент в массиве\
    }

    
    confirmBtn.addEventListener("click", handleConfirm);
    cancelBtn.addEventListener("click", handleCancel);

    function displayNews() {
        var storedNews = JSON.parse(localStorage.getItem('recipes')) || [];
        var recipesContainer = document.getElementById('recipe_table');
        recipesContainer.innerHTML = `<tr>
        <th>
        Рецепт
        </th>
        <th>
        Изображение
        </th>
        <th>
        Дата добавления
        </th>
        <th>
        Дата обновления
        </th>
    </tr>`; // Очищаем контейнер перед заполнением
    
        storedNews.forEach(function(news, i) {
            var newsItem = document.createElement('tr');
            //newsItem.className = 'news-item';

    //это обновление рецептов по базе данных. пересмотреть
            var newsHTML = `
                    <th>
                        <div class="news-item">
                            <div id ="recipeName" class="recipeName"><h3>${news.name}</h3></div>
                            <div id ="ingredients" class = "recipe_full"><p>${news.recipeIngredients}
                            </p></div>
                            <div class="newsBtns">
                                <button class="delete-button" id="deleteBtn" data-index="">Удалить</button>
                                <button class="update-button" id="updateBtn" data-index="">Изменить</button>
                            </div>
                        </div>
                    </th>
                    <th><a href="concreteRecipe.html"><img src=${news.newsImgName} alt=${news.name}></a>
                    </th>
                    <th>${news.DateName}</th>
                    <th>${news.editDate}</th>
                
            `;
    
            newsItem.innerHTML = newsHTML;
            recipesContainer.appendChild(newsItem);
    
            var deleteButton = newsItem.querySelector(".delete-button");
            deleteButton.addEventListener('click', function() {
                deleteNews(i);
                console.log("Добавление слушателя для i="+i);
            });
    
            var updateButton = newsItem.querySelector(".update-button");
            updateButton.dataset.index = i; // Устанавливаем индекс элемента в атрибут data-index
            updateButton.addEventListener('click', function () {
                updateNews(parseInt(this.dataset.index));
            });
    
        });
    }

    function displaySortNews(sortNews){
        var recipesContainer = document.getElementById('recipe_table');
        recipesContainer.innerHTML = `<tr>
        <th>
        Рецепт
        </th>
        <th>
        Изображение
        </th>
        <th>
        Дата добавления
        </th>
    </tr>`;
        sortNews.forEach(function(news, i) {
            var newsItem = document.createElement('tr');
            //newsItem.className = 'news-item';
    
            var newsHTML = `
                    <th>
                        <div class="news-item">
                            <div id ="recipeName" class="recipeName"><h3>${news.name}</h3></div>
                            <div id ="ingredients" class = "recipe_full"><p>${news.recipeIngredients}
                            </p></div>
                            <div class="newsBtns">
                                <button class="delete-button" id="deleteBtn" data-index="">Удалить</button>
                                <button class="update-button" id="updateBtn" data-index="">Изменить</button>
                            </div>
                        </div>
                    </th>
                    <th><a href="concreteRecipe.html"><img src=${news.newsImgName} alt=${news.name}></a>
                    </th>
                    <th>${news.DateName}</th>
                
            `;

            
    
            newsItem.innerHTML = newsHTML;
            recipesContainer.appendChild(newsItem);
    
            var deleteButton = newsItem.querySelector(".delete-button");
            deleteButton.addEventListener('click', function() {
                deleteNews(i);
                console.log("Добавление слушателя для i="+i);
            });
    
            var updateButton = newsItem.querySelector(".update-button");
            updateButton.dataset.index = i; // Устанавливаем индекс элемента в атрибут data-index
            updateButton.addEventListener('click', function () {
                updateNews(parseInt(this.dataset.index));
            });
        });
    }

    function deleteNews(index) {
        console.log("Удаляю"+index);
        var deleteModal = document.getElementById('deleteModal');
        var modalConfirm = document.getElementById('modal-confirm');
        var modalCancel = document.getElementById('modal-cancel');
        var storedComms = JSON.parse(localStorage.getItem('recipes')) || [];
      
        deleteModal.style.display = 'block';
      
        modalConfirm.addEventListener('click', function() {
          deleteModal.style.display = 'none';
          storedComms.splice(index, 1);
          
          localStorage.setItem('recipes', JSON.stringify(storedComms));
          displayNews();
        });
      
        modalCancel.addEventListener('click', function() {
          deleteModal.style.display = 'none';
        });
    }    

    form.addEventListener('input', function(event) {
        formData.name=myInput.value;
        formData.recipeIngredients=recipeIngredients.value;
        formData.newsImgName=newsImgInput.value;
        formData.descrptn=descrptn.value;
        
        LS.setItem('recipeData', JSON.stringify(formData));
    });

    document.getElementById('btn').addEventListener('click', function(event) {
        event.preventDefault(); 
        // Предотвращаем отправку формы
        //получаем список новостей
        var storedNews = JSON.parse(LS.getItem('recipes')) || [];
        console.log("StoredNews "+storedNews.name);
        //достаем новый элемент из LS
        var newElement = JSON.parse(LS.getItem('recipeData')) || {};
        newElement.DateName=getCurrentDateTime();
        newElement.editDate=getCurrentDateTime();
        // Добавляем новую новость в список
        storedNews.push(newElement);

        // if(Object.keys(newElement).length!=4){
        //     return;
        // }

        // Обновляем данные в Local Storage
        LS.setItem('recipes', JSON.stringify(storedNews));
        LS.removeItem('recipeData');
        displayNews();
    });

    document.getElementById("sortButton").addEventListener("click", function() {
        // Получение значений из компонентов Date Picker и Time Picker
        var selectedDate = document.getElementById("datePicker").value;
        var selectedTime = document.getElementById("timePicker").value;
        
        // Объединение выбранной даты и времени в одну строку формата "YYYY-MM-DDTHH:mm"
        var selectedDateTime = selectedDate + "T" + selectedTime; 
        // Преобразование выбранной даты и времени в объект Moment.js для работы с ними
        var selectedMoment = moment(selectedDateTime, "YYYY-MM-DDTHH:mm");
        // Получение текущей даты и времени
        var currentMoment = moment();
        // Вычисление разницы во времени между выбранной и текущей датой и временем
        var timeDifference = currentMoment.diff(selectedMoment, "minutes");
        // Вывод разницы во времени в консоль
        console.log("Разница во времени (минуты):", timeDifference);
        // Здесь вы можете выполнить сортировку или другую логику на основе полученной разницы во времени

        var storedNews = JSON.parse(LS.getItem('news')) || [];
        var sortedNews = [];
    
        storedNews.forEach(function(news, i) {
            var sortMoment = moment(news.DateName,"YYYY-MM-DDTHH:mm");
            var sortTimeDiff = currentMoment.diff(sortMoment, "minutes")
            if(sortTimeDiff<=timeDifference){
                sortedNews.push(news);
            }
        });

        displaySortNews(sortedNews);
      });

      document.getElementById("cancelBtn").addEventListener("click",function(){
        displayNews();
      });

      document.getElementById("searchButton").addEventListener("click", function(){
        var searchElement = document.getElementById("searchField");
        
        var searchText = searchElement.value.toLowerCase();
        console.log("Ищу строку с "+searchText);

        var storedNews = JSON.parse(LS.getItem('recipes')) || [];
        var sortedNews = [];
    
        storedNews.forEach(function(news, i) {
            var sortText = news.shortDescName.toLowerCase();
            
            if(sortText.includes(searchText)){
                sortedNews.push(news);
            }
        });

        displaySortNews(sortedNews);

      });

      displayNews();

      
      recipeIngredients.value = data.recipeIngredients || '';
      MyInput.value = data.MyInput || '';
      newsImgInput.value = data.newsImgName || '';
      descrptn.value = data.descrptn || '';

});



