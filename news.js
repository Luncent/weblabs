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


  function displayNews() {
    var storedNews = JSON.parse(LS.getItem('news')) || [];
    var newsContainer = document.getElementById('newsContainer');
    newsContainer.innerHTML = ''; // Очищаем контейнер перед заполнением

    storedNews.forEach(function(news) {
        var newsItem = document.createElement('div');
        newsItem.className = 'news-item';

        var newsHTML = `
            <div class="date">${news.DateName}</div>
            <img src="${news.newsImgName}">
            <div class="news-content">
                <h3>${news.shortDescName}</h3>
                <a href="${news.newsLinkName}">Подробнее</a>
            </div>
        `;

        newsItem.innerHTML = newsHTML;
        newsContainer.appendChild(newsItem);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formAddNews');
    

    displayNews();

    let formData = {};
    var data = JSON.parse(LS.getItem('formData'))||{};
    const newsLinkInput = document.getElementById('newsLinkID');
    const newsDescrInput = document.getElementById('shortDescrID');
    const newsImgInput = document.getElementById('newsImgID');
    newsLinkInput.value = data.newsLinkName || '';
    newsDescrInput.value = data.shortDescName || '';
    newsImgInput.value = data.newsImgName || '';
    

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
});


