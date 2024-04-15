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
    const form = document.getElementById('formAddNews');
    
    var modal = document.getElementById("modal");
    var input1 = document.getElementById("input1");
    var input2 = document.getElementById("input2");
    var input3 = document.getElementById("input3");
    var confirmBtn = document.getElementById("confirmBtn");
    var cancelBtn = document.getElementById("cancelBtn");

    var modalData = [];

    function openModal(newsToUpdate) {
        modal.style.display = "flex";
        input1.value=newsToUpdate.shortDescName;
        input2.value=newsToUpdate.newsImgName;
        input3.value=newsToUpdate.newsLinkName;
    }
    
    function closeModal() {
        modal.style.display = "none";
    }
    
    function handleConfirm() {
        var value1 = input1.value;
        var value2 = input2.value;
        var value3 = input3.value;
        // Делайте что-то с введенными значениями...
        console.log("Название новости:", value1);
        console.log("Ссылка на изображение:", value2);
        console.log("Ссылка на новость:", value3);

        modalData = [value1, value2, value3]; 

        var storedNews = JSON.parse(LS.getItem('news')) || [];
        console.log("Индекс окна"+modal.dataset.index)
        var newsToUpdate = storedNews[modal.dataset.index];

        newsToUpdate.shortDescName = modalData[0];
        newsToUpdate.newsImgName = modalData[1];
        newsToUpdate.newsLinkName = modalData[2];

        modalData[0]="";
        modalData[1]="";
        modalData[2]="";

        // Обновите данные в Local Storage
        LS.setItem('news', JSON.stringify(storedNews));
        displayNews();  //Обновите отображение после изменения
        console.log("modalData", modalData);
        closeModal();
    }
    
    function handleCancel() {
        closeModal();
    }
    
    
    function updateNews(index) {
        // Получите элемент новости по индексу
        var storedNews = JSON.parse(LS.getItem('news')) || [];
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
        var storedNews = JSON.parse(LS.getItem('news')) || [];
        var newsContainer = document.getElementById('newsContainer');
        newsContainer.innerHTML = ''; // Очищаем контейнер перед заполнением
    
        storedNews.forEach(function(news, i) {
            var newsItem = document.createElement('div');
            newsItem.className = 'news-item';
    
            var newsHTML = `
                <div class="date">${news.DateName}</div>
                <img src="${news.newsImgName}">
                <div class="news-content">
                    <h3>${news.shortDescName}</h3>
                    <a href="${news.newsLinkName}">Подробнее</a>
                </div>
                <div class="newsBtns">
                    <button class="delete-button" id="deleteBtn" data-index="`+i+`">Удалить</button>
                    <button class="update-button" id="updateBtn" data-index="`+i+`">Изменить</button>
                </div>
            `;
    
            newsItem.innerHTML = newsHTML;
            newsContainer.appendChild(newsItem);
    
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
        var newsContainer = document.getElementById('newsContainer');
        newsContainer.innerHTML = ''; // Очищаем контейнер перед заполнением
    
        sortNews.forEach(function(news, i) {
            var newsItem = document.createElement('div');
            newsItem.className = 'news-item';
    
            var newsHTML = `
                <div class="date">${news.DateName}</div>
                <img src="${news.newsImgName}">
                <div class="news-content">
                    <h3>${news.shortDescName}</h3>
                    <a href="${news.newsLinkName}">Подробнее</a>
                </div>
                <div class="newsBtns">
                    <button class="delete-button" id="deleteBtn" data-index="`+i+`">Удалить</button>
                    <button class="update-button" id="updateBtn" data-index="`+i+`">Изменить</button>
                </div>
            `;
    
            newsItem.innerHTML = newsHTML;
            newsContainer.appendChild(newsItem);
    
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
        console.log("Удаление элемента  i="+index);
        var storedNews = JSON.parse(LS.getItem('news')) || [];
        storedNews.splice(index, 1); // Удаляем элемент из массива
    
        LS.setItem('news', JSON.stringify(storedNews));
        displayNews(); // Обновляем отображение после удаления
    }    

    form.addEventListener('input', function(event) {
        formData.newsLinkName=newsLinkInput.value;
        formData.shortDescName=newsDescrInput.value;
        formData.newsImgName=newsImgInput.value;
        LS.setItem('formData', JSON.stringify(formData));
    });

    document.getElementById('btnAddNews').addEventListener('click', function(event) {
        event.preventDefault(); 
        // Предотвращаем отправку формы
        //получаем список новостей
        var storedNews = JSON.parse(LS.getItem('news')) || [];

        //достаем новый элемент из LS
        var newElement = JSON.parse(LS.getItem('formData')) || {};
        newElement.DateName=getCurrentDateTime();
        // Добавляем новую новость в список
        storedNews.push(newElement);

        if(Object.keys(newElement).length!=4){
            return;
        }

        // Обновляем данные в Local Storage
        LS.setItem('news', JSON.stringify(storedNews));
        LS.removeItem('formData');
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

        var storedNews = JSON.parse(LS.getItem('news')) || [];
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

      let formData = {};
      var data = JSON.parse(LS.getItem('formData'))||{};
      const newsLinkInput = document.getElementById('newsLinkID');
      const newsDescrInput = document.getElementById('shortDescrID');
      const newsImgInput = document.getElementById('newsImgID');
      newsLinkInput.value = data.newsLinkName || '';
      newsDescrInput.value = data.shortDescName || '';
      newsImgInput.value = data.newsImgName || '';

});


