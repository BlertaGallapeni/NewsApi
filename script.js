$(document).ready(function () {
   request();
  });
  $("#searchbtn").on("click", function (e) {
    e.preventDefault();
    request();
  });
  $("#lang").on("change", function () {
    request();
  });
  
  //date formatter
  function dateFormatter(date) {
    let Day = new Date(date).getDate();
    let Month = new Date(date).getMonth() + 1;
    let Year = new Date(date).getFullYear();
  
    return [Month, Day, Year].join("/");
  }
  
  // create card
  function createCards() {
    var list1 = document.getElementsByClassName("card");
    var i;
    for (i = 0; i < list1.length; i++) {
      var element = document.createElement("div");
      element.setAttribute("class", "imgBx");
      list1[i].appendChild(element);
  
      var contentBox = document.createElement("div");
      contentBox.setAttribute("class", "content-box");
      list1[i].appendChild(contentBox);
    }
  
    var list2 = document.getElementsByClassName("imgBx");
    for (i = 0; i < list2.length; i++) {
      var img = document.createElement("img");
      list2[i].appendChild(img);
      img.setAttribute("id", "img" + (i + 1));
    }
  
    var list3 = document.getElementsByClassName("content-box");
    for (i = 0; i < list3.length; i++) {
      var title = document.createElement("h2");
      list3[i].appendChild(title);
      title.setAttribute("id", "title" + (i + 1));
      var summary = document.createElement("p");
      list3[i].appendChild(summary);
      summary.setAttribute("id", "summary" + (i + 1));
      var dateOf = document.createElement("div");
      list3[i].appendChild(dateOf);
      dateOf.setAttribute("class", "date");
    }
    
    var list4 = document.getElementsByClassName("date");
    for (i = 0; i < list4.length; i++) {
      var date = document.createElement("span");
      list4[i].appendChild(date);
      date.setAttribute("id", "date" + (i + 1));
      var category = document.createElement("div");
      list4[i].appendChild(category);
      category.setAttribute("class", "category");
    }
    
    var list5 = document.getElementsByClassName("category");
    for (i = 0; i < list5.length; i++) {
      var rank = document.createElement("span");
      list5[i].appendChild(rank);
      rank.setAttribute("id", "rank" + (i + 1));
      rank.setAttribute("class", "rank");
      var topic = document.createElement("span");
      list5[i].appendChild(topic);
      topic.setAttribute("id", "topic" + (i + 1));
    }
  }
  
  // pagination
  function getPageList(totalPages, page, maxLength) {
    function range(start, end) {
      return Array.from(Array(end - start + 1), (_, i) => i + start); 
    }
  
    var sideWidth = maxLength < 7 ? 1 : 2;
    var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
    var rightWidth = (maxLength - sideWidth * 2 - 3) >> 1;
  
    if (totalPages <= maxLength) {
      return range(1, totalPages);
    }
    if (page <= maxLength - sideWidth - 1 - rightWidth) {
      return range(1, maxLength - sideWidth - 1).concat(
        0,
        range(totalPages - sideWidth + 1, totalPages)
      );
    }
  
    if (page >= totalPages - sideWidth - 1 - rightWidth) {
      return range(1, sideWidth).concat(
        0,
        range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages)
      );
    }
  
    return range(1, sideWidth).concat(
      0,
      range(page - leftWidth, page + rightWidth),
      0,
      range(totalPages - sideWidth + 1, totalPages)
    );
  }
  
  // pagination
  function pagination() {
      var numberOfItems = $(".newsContainer .card").length;
      var limitPerPage = 8; // sa karta per faqe
      var totalPages = Math.ceil(numberOfItems / limitPerPage);
      var paginationSize = 6; // sa elemente te pagination
      var currentPage;
      function showPage(whichPage) {
        if (whichPage < 1 || whichPage > totalPages) return false;
  
        currentPage = whichPage;
  
        $(".newsContainer .card")
          .hide()
          .slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage)
          .show();
  
        $(".pagination li").slice(1, -1).remove();
  
        getPageList(totalPages, currentPage, paginationSize).forEach((item) => {
          $("<li>")
            .addClass("page-item")
            .addClass(item ? "current-page" : "dots")
            .toggleClass("active", item === currentPage)
            .append(
              $("<a>")
                .addClass("page-link")
                .attr({ href: "#" })
                .text(item || "...")
            )
            .insertBefore(".next-page");
        });
  
        $(".previous-page").toggleClass("disable", currentPage === 1);
        $(".next-page").toggleClass("disable", currentPage === totalPages);
        return true;
      }
      $(".pagination").append(
        $("<li>")
          .addClass("page-item")
          .addClass("previous-page")
          .append(
            $("<a>").addClass("page-link").attr({ href: "#" }).text("Prev")
          ),
        $("<li>")
          .addClass("page-item")
          .addClass("next-page")
          .append($("<a>").addClass("page-link").attr({ href: "#" }).text("Next"))
      );
  
      $(".newsContainer").show();
      showPage(1);
  
      $(document).on(
        "click",
        ".pagination li.current-page:not(.active)",
        function () {
          return showPage(+$(this).text());
        }
      );
  
      $(".next-page").on("click", function () {
        return showPage(currentPage + 1);
      });
  
      $(".previous-page").on("click", function () {
        return showPage(currentPage - 1);
      });
  }
  
  
  // second GET request
  function request() {
    let lang;
    if ($("#lang").val() !== null) {
      lang = $("#lang").val();
    } else {
      lang = "en";
    }

    let query;
    if ($("#searchquery").val() !== "") {
      query = $("#searchquery").val();
    } else {
      query = "bitcoin";
    }

    const settings = {
      async: true,
      crossDomain: true,
      url:
        "https://newscatcher.p.rapidapi.com/v1/search_enterprise?q=" +
        query +
        "&lang=" +
        lang +
        "&sort_by=relevancy&page=1&media=True",
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "734ba05c98msh58446854e0b5e09p126d84jsncf0941d8531a",
        "X-RapidAPI-Host": "newscatcher.p.rapidapi.com"
      }
    };
  
    $.ajax(settings).done(function (response) {
      console.log(response);
  
      var list8 = response.articles.length;
      var container = document.getElementById("newsContainer");
      container.replaceChildren();
      for (let i = 0; i < list8; i++) {
        var createCard = document.createElement("div");
        createCard.setAttribute("class", "card");
        container.appendChild(createCard);
      }
      createCards();
  
      var list7 = document.getElementsByClassName("card");
      for (var i = 0; i < list7.length; i++) {
        document.getElementById("title" + (i + 1)).innerHTML =
          response.articles[i].title;
        document.getElementById("summary" + (i + 1)).innerHTML =
          response.articles[i].summary;
        document.getElementById("rank" + (i + 1)).innerHTML =
          response.articles[i].rank + " | ";
        document.getElementById("topic" + (i + 1)).innerHTML =
          response.articles[i].topic;
        document.getElementById("img" + (i + 1)).src = response.articles[i].media;
        document.getElementById("date" + (i + 1)).innerHTML = dateFormatter(
          response.articles[i].published_date
        );
      }
      pagination();
    });
  }
  
  // onclick change to loading...
  setTimeout(() => {
    const linkbtn = document.getElementsByTagName("a")[0];
    // linkbtn.removeAttribute("href");
    linkbtn.onclick = function () {
      linkbtn.innerText = "Loading...";
    };
  }, Math.random() * 3000);
  