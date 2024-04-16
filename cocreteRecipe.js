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
    const commentDate = document.getElementById('DateID');
    const commentDescr = document.getElementById('description');

    const stars = document.querySelectorAll('.star'); // Получаем все элементы с классом "star"
    const form = document.getElementById("formComment");

    // Function to handle the star click event
    function handleStarClick(event) {
      const clickedStar = event.target;
      const clickedIndex = Array.from(stars).indexOf(clickedStar);

      // Remove the "selected" class from all stars
      stars.forEach(function(star, index) {
      if (index <= clickedIndex) {
        star.classList.add('selected');
      } else {
        star.classList.remove('selected');
      }
      });

      // Update the local storage or perform any other necessary actions
      const selectedStars = document.querySelectorAll('.star.selected');
      const numberOfStars = selectedStars.length;
      var comment = {
      date: "",
      descr: commentDescr.value,
      rating: numberOfStars
      };
      localStorage.setItem('commentData', JSON.stringify(comment));
    }

    // Attach the event listener to each star element
    stars.forEach(function(star) {
      star.addEventListener('click', handleStarClick);
    });
    
    form.addEventListener('input', function(event) {
        const selectedStars = document.querySelectorAll('.star.selected');
        const numberOfStars = selectedStars.length;
        console.log("writing");
        var comment = {
            date: "",
            descr: commentDescr.value,
            rating: numberOfStars
        };

       /* comment.date=getCurrentDateTime();
        comment.descr=commentDescr.value;
        comment.rating=numberOfStars;*/

        localStorage.setItem('commentData', JSON.stringify(comment));
    });

    function getStarHTML(selectedStars) {
      var starHTML = '';
      for (let i = 0; i < 5; i++) {
        const selected = i < selectedStars;
        const starClass = selected ? 'comStar selected' : 'comStar';
        starHTML += `<span class="${starClass}"></span>`;
      }
      return starHTML;
    }

    function displayComms() {
      //отображение элементов (отзывов)
      var storedComms = JSON.parse(localStorage.getItem('Comments')) || [];
      var commsContainer = document.getElementById('commentContainer');
      commsContainer.innerHTML = ''; // Очищаем контейнер перед заполнением
  
      storedComms.forEach(function(comment, i) {
          var commentItem = document.createElement('div');
          commentItem.className = 'commentExample';
  
          var commentHTML = `
          <div class="DateRating">
            <div class="comRating">
              ${getStarHTML(comment.rating)} <!-- Add the selected stars HTML -->
            </div>
            <div class="commentDate">
              <p>${comment.date}</p>
            </div>
            <div class="commBtns">
              <button class="update-button" id="updateBtn" data-index="">Изменить</button>
              <button class="deleteCom-btn" id="deleteBtn" data-index="`+i+`">Удалить</button>
            </div> 
          </div>

          <div class="commentItself">
            <p>${comment.descr}</p>
          </div>`;
          commentItem.innerHTML = commentHTML;
          commsContainer.appendChild(commentItem);

          // Получаем кнопку "Удалить'
          var deleteButton = commentItem.querySelector('.deleteCom-btn');
          deleteButton.addEventListener('click', function(event) {
              DeleteComment(i);
              console.log("Добавление слушателя для комментария "+i);
          });

          var updateButton = commentItem.querySelector(".update-button");
          updateButton.addEventListener('click', function() {
            EditComm(i);
          });
      });

      //заполняем форму сохраненными значениями
      var formData = JSON.parse(localStorage.getItem('commentData')) || {};
      commentDescr.value=formData.descr || "";

      stars.forEach(function(star,index){
        if(index+1<=formData.rating){
          star.classList.add('selected');
        }
        else{
          star.classList.remove('selected');
        }
      });
    }

    function EditComm(index) {
      var editModal = document.getElementById('editModal');
      var editDescr = document.getElementById('editDescr');
      var editRating = document.getElementById('editRating');
      var editConfirm = document.getElementById('edit-confirm');
      var editCancel = document.getElementById('edit-cancel');
    
      var storedComms = JSON.parse(localStorage.getItem('Comments')) || [];
      var comment = storedComms[index];
    
      // Заполнение полей модального окна данными комментария
      editDescr.value = comment.descr;
      editRating.value = comment.rating;
      // Отображение модального окна
      editModal.style.display = 'block';
    
      editConfirm.addEventListener('click', function() {
        editModal.style.display = 'none';
        comment.descr=editDescr.value;
        comment.rating=editRating.value;
        comment.date=getCurrentDateTime();
        localStorage.setItem('Comments', JSON.stringify(storedComms));
        displayComms();
      });
    
      editCancel.addEventListener('click', function() {
        editModal.style.display = 'none';
      });
    }

    function DeleteComment(index) {
      console.log("Удаляю"+index);
      var deleteModal = document.getElementById('deleteModal');
      var modalConfirm = document.getElementById('modal-confirm');
      var modalCancel = document.getElementById('modal-cancel');
      var storedComms = JSON.parse(localStorage.getItem('Comments')) || [];
    
      deleteModal.style.display = 'block';
    
      modalConfirm.addEventListener('click', function() {
        deleteModal.style.display = 'none';
        storedComms.splice(index, 1);
        
        localStorage.setItem('Comments', JSON.stringify(storedComms));
        displayComms();
      });
    
      modalCancel.addEventListener('click', function() {
        deleteModal.style.display = 'none';
      });
    }  

    displayComms();
    
    //кнопка на форме добавления отзыва
    document.getElementById('addCom').addEventListener('click', function(event) {
      event.preventDefault(); 
      // Предотвращаем отправку формы
      //получаем список отзывов
      var storedComms = JSON.parse(localStorage.getItem('Comments')) || [];
      //достаем новый элемент из LS
      var newElement = JSON.parse(localStorage.getItem('commentData')) || {};
      //при пустом отзыве он не сохраняется
      if(newElement.descr==""){
        return;
      }
      newElement.date=getCurrentDateTime();
      // Добавляем новую новость в список
      storedComms.push(newElement);

      // Обновляем данные в Local Storage
      localStorage.setItem('Comments', JSON.stringify(storedComms));
      localStorage.removeItem('commentData');

      //очистить поля формы
      stars.forEach(function(star) {
        star.classList.remove('selected');
      });
      commentDescr.value="";

      //отобразить отзывы
      displayComms();
  });

  

});