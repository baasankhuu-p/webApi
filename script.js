const http = require('http');
const fs = require('fs');
const {Pool} = require('pg');

const port = 5000;

const server = http.createServer((req, res) => {
  let urlpath = req.url.split("/")[1];

const pool = new Pool({
  "host": "localhost",
  "user": "postgres",
  "port": 5432,
  "database": "MyDB",
  "password": "12345678"
});
//#region start
  res.write(`<!DOCTYPE html> <html lang="en"><head><link rel="icon" type="image/png" sizes="16x16" href="https://baasankhuup.github.io/Look-TV/SVG/LookTv.png"><link rel="stylesheet" href="https://baasankhuup.github.io/Look-TV/CSS/All.css"><meta charset="UTF-8"><meta name="description" content="Look tv Movie Site"><meta name="keywords" content="Look, Tv, Movie, Кино, Kino site,кино сайт"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.2/css/all.css" integrity="sha384-vSIIfh2YWi9wW0r9iZe7RJPrKwp6bG+s9QZMoITbCckVJqGCCRhc+ccxNcdpHuYu" crossorigin="anonymous"><title>Look TV</title> </head> <body onload="initClock()"><header class="menu-header">       <a  class="main-links"  href="/home"> <img class="logo" src="https://baasankhuup.github.io/Look-TV/HIMG/logo.png" alt="Logo"></a>      <nav class="main-menu">         <ul class="menu-list">           <li><a class="main-links" href="/home">Нүүр</a></li>           <li><a class="main-links" href="/Bagts">Багц</a></li>           <li><a class="main-links" href="/Sale">Урамшуулал</a></li>           <li><a class="main-links" href="/Turees">Түрээсэлсэн</a></li>           <li><a class="main-links" href="/Tv">ТВ</a></li>         </ul>         <div class="search-movie">           <select id="Select_Movie">             <option value="All">Бүх</option>             <option value="Mov">Киноны нэр</option>             <option value="act">Жүжигчин</option>             <option value="aut">Зохиолч</option>           </select>             <input type="text" id="myInput" onkeyup="myFunction()" placeholder="Кино, ТВ шоуг хайх" title="Хайх кино, ТВ-гээ оруулна уу">             <button type="submit" title="Хайх">Хайх</button>         </div>       <ul class="icon-list">           <li><a class="main-links" href="/information" class="icon-information"><img src="https://baasankhuup.github.io/Look-TV/SVG/profile.svg"  alt="profile" title="Мэдээлэл"></a></li>           <li><a class="main-links" href="/content" class="icon-content"><img src="https://baasankhuup.github.io/Look-TV/SVG/time.svg" alt="time" title="Контент үзсэн түүх"></a></li>           <li><a class="main-links" href="/setting" class="icon-settings"><img src="https://baasankhuup.github.io/Look-TV/SVG/setting.svg" alt="setting" title="Тохиргоо"></a></li>           <li><a class="main-links" href="/help" class="icon-help"><img src="https://baasankhuup.github.io/Look-TV/SVG/help.svg" alt="help" title="Тусламж"></a></li>           <li><a class="main-links" href="/logout" class="icon-link"><img src="https://baasankhuup.github.io/Look-TV/SVG/sign-out.svg" alt="sign-out" title="Гарах"></a></li>       </ul>       </nav>   </header>   <style>     .mySlides {display: none}   </style>     <main id="myMain">   `);
///////////
    switch(urlpath){
        //#region home data
      case "home" :
      res.statusCode = 200;
      res.write(`
       <link rel="stylesheet" href="https://baasankhuup.github.io/Look-TV//CSS/Home.css">`);
       
       //BIG SLIDE
      pool.query(`SELECT * FROM "imageurl" where size='width'`, (err, data)=>{
        res.write('<div id="Big-slide">');
        res.write(` <div class="mySlides">
                    <img class="MovieImg" src="https://baasankhuup.github.io/Look-TV/WIMG/image1.jpg" alt="dragon">
                  </div>`);
        for(const row of data.rows){ 
          res.write(`
          <div class="mySlides">
            <img class="MovieImg" src="${row.url}" alt="${row.title}" title="${row.title}">
          </div>
          `)}
        res.write(`
        <button class="Big-Prev" onclick="plusSlides(-1)">❮</button>
        <button class="Big-Next" onclick="plusSlides(1)">❯</button>
        </div>
        `);
        //Шинээр нэмэгдсэн кино
        pool.query(`select * from imageurl i where i.size='height' limit 4`,(err, data)=>{
          res.write(`
          <section class="News">
            
            <h2>Шинээр нэмэгдсэн кино</h2>
            <div class="Smallslide" style="display: block;">
                <button class="stars-right-1" onclick="plusSlides1(-1)">❮</button>
                <button class="stars-left-1" onclick="plusSlides1(1)">❯</button>
                  <div class="Smallslide" style="display: block;">
          `);
          for(const row of data.rows){
            res.write(`<a href="#"><img class="Small" src="${row.url}" alt="${row.title}" title="${row.title}" style="display:inline-block"></a>`);
          }
          res.write(`</div></div></section>`);
          //Үзсэн кинонууд
          pool.query(`select s.name,i.title,i.url,i.size,i.angilal from imageurl i, sungah s where i.name=s.name and i.size='height'  limit 4
          `,(err, data) =>{
            res.write(`
            <section class="News">
              <h2>Үзсэн кинонууд</h2>
              <button class="stars-right-2">❮</button>
              <button class="stars-left-2">❯</button>
              <div class="Smallslide" style="display: block;">
            `);
            for(const row of data.rows){
              res.write(`
              <a href="LookTv-KinoMedeelel.html">
              <img src="${row.url}" alt="${row.title}" title="${row.title}">
              </a>
              `);
            }
            res.write(`</div></section>`);
            //Трайлер
            pool.query(`select * from imageurl where size='trailer' and name='Godzilla vs Kong'`,(err,data) =>{
              res.write(`<section class="trailer">
              <h3>KinoTrailer</h3>
              <video width="750" height="400" controls="" autoplay="" muted="">
              `);
              for(const row of data.rows){
                res.write(`<source src="${row.url}" type="video/${row.angilal}" title="${row.name}">`);
              }
              res.write('</video></section>');
              //Төлбөрийн мэдээ
              pool.query(`select * from tolboriinmedee`,(err,data)=>{
                res.write(`<section class="table"><h1>Төлбөрийн мэдээлэл</h1>`);
                for(const row of data.rows){
                  res.write(`
                  <div class="piece_price2">
                  <h2>${row.due} сар</h2>
                  <h3>${row.money}</</h3>
                  <h3>${row.bagts}</</h3>
                  <h3>${row.freemovie}ш кино</</h3>
                  <h3>ТВ-${row.freetv} сар үнэгүй</h3>
                  <button>авах</button>
                  </div>`);
                }
                res.write(`<script>
      
                function updateClock(){
                  ///Automatic clo
                  var now = new Date();
                  var yr = now.getFullYear(),
                      hou = now.getHours(),
                      min = now.getMinutes(),
                      sec = now.getSeconds();
                      if(hou == 0){
                        hou = 00;
                      }
                      if(hou > 24){
                        hou = hou - 24;
                      }
              
                      Number.prototype.p = function(digits){
                        for(var n = this.toString(); n.length < digits; n = 0 + n);
                        return n;
                      }
                      var ids = ["hour", "minutes", "seconds"];
                      var values = [hou.p(2), min.p(2), sec.p(2)];
                      for(var i = 0; i < ids.length; i++)
                      document.getElementById(ids[i]).firstChild.nodeValue = values[i];
                }
              
                function initClock(){
                  updateClock();
                  window.setInterval("updateClock()", 1);
                }
                    //Big images slider
                    var slideIndex = 1;
                    showSlides(slideIndex);
                    
                    function plusSlides(n) {
                      showSlides(slideIndex += n);
                    }
                    
                    function currentSlide(n) {
                      showSlides(slideIndex = n);
                    }
                    
                    function showSlides(n) {
                      var i;
                      var slides = document.getElementsByClassName("mySlides");
                      if (n > slides.length) {slideIndex = 1}    
                      if (n < 1) {slideIndex = slides.length}
                      for (i = 0; i < slides.length; i++) {
                          slides[i].style.display = "none";  
                      }
                      slides[slideIndex-1].style.display = "block"
                    }
                    //Tv Change
                    function changeSrc(anything,title){
                    document.querySelector('.tvsChanges').src = anything;
                    document.querySelector('.tvsChanges').title = title;
                    console.log(anything);
                  }
                  </script>`);
                res.write(`</section>`);
                res.write(`
                </main><div class="messenger"><a href="#"><img src="https://baasankhuup.github.io/Look-TV/SVG/chat.png" alt="Chat" title="Холбоо барина уу"></a></div><footer><nav class="foot-nav"><article class="footer-nav"><h2 class="footer-package">Багц</h2><p><a class="main-links" href="/HIT">Хит цуврал</a></p><p><a class="main-links" href="/Anime">Аниме</a></p><p><a class="main-links" href="/HBO">HBO олон ангит</a></p><p><a class="main-links" href="/Huuhdiin_Bagts">Хүүхдийн багц</a></p><p><a class="main-links" href="/Oros_Bagts">Орос-Европ багц</a></p></article><article class="footer-nav"><h2 class="footer-help">Тусламж</h2><p><a href="#">Холбоо барих</a></p><p><a href="#">Сошиал хуудас</a></p><p><a href="#">Онлайн хуудас</a></p></article><article class="footer-nav"><h2 class="footer-regist">Бүртгэл</h2><p><a class="main-links" href="/logout">Гарах</a></p><p><a href="#">Нууц үг солих</a></p></article><article class="footer-nav"><h2 class="footer-setting">Тохиргоо</h2><p><a class="main-links" href="/setting">Тохиргоо</a></p><p><a class="main-links" href="/information">Хувийн мэдээлэл</a></p><p><a href="#">Имейл</a></p></article><article class="footer-nav"><h2 class="footer-sale">Урамшуулал</h2><p><a class="main-links" href="/Sale">Байнгын</a></p><p><a class="main-links" href="/Sale">Баяр ёслолын</a></p></article></nav></footer></body></html>
        `);
           res.end();
              });
            });
          });
        });
      });
      
 break
        //#endregion home end
      case "Bagts" : res.write('<link rel="stylesheet" href="https://baasankhuup.github.io/Look-TV//CSS/Bagts.css">');
      res.statusCode = 200;
      //Hit Movie  
      pool.query(`SELECT * FROM "imageurl" where size='height' and angilal='Anime' limit 4 `, (err, data)=>{
          res.write(`<section class="HIT-Movie">
          <h1>Аниме</h1>`);
          for(const row of data.rows)
          {
            res.write(`<a href=#><img src="${row.url}" title="${row.title}" alt="${row.title}"></a>`);
          }
          res.write(`</section>`);
          //Аниме
          pool.query(`SELECT * FROM "imageurl" where size='height' and angilal='Hit' limit 4 `, (err, data)=>{
            res.write(`<section class="HIT-Movie">
            <h1>Хит кино</h1>`);
            for(const row of data.rows)
            {
              res.write(`<a href=#><img src="${row.url}" title="${row.title}" alt="${row.title}"></a>`);
            }
            res.write(`</section>`);
            //HBO
            pool.query(`SELECT * FROM "imageurl" where size='height' and angilal='OlonAngit' limit 4 `, (err, data)=>{
              res.write(`<section class="HIT-Movie">
              <h1>HBO ОАК</h1>`);
              for(const row of data.rows)
              {
                res.write(`<a href=#><img src="${row.url}" title="${row.title}" alt="${row.title}"></a>`);
              }
              res.write(`</section>`);
              //Хүүхдийн кино
              pool.query(`SELECT * FROM "imageurl" where size='height' and angilal='Child' limit 4 `, (err, data)=>{
                res.write(`<section class="HIT-Movie">
                <h1>Хүүхдийн Кино</h1>`);
                for(const row of data.rows)
                {
                  res.write(`<a href=#><img src="${row.url}" title="${row.title}" alt="${row.title}"></a>`);
                }
                res.write(`</section>`);
                //Орос-евро
                pool.query(`SELECT * FROM "imageurl" where size='height' and angilal='oros-euro' limit 4 `, (err, data)=>{
                  res.write(`<section class="HIT-Movie">
                  <h1>Орос-евро</h1>`);
                  for(const row of data.rows)
                  {
                    res.write(`<a href=#><img src="${row.url}" title="${row.title}" alt="${row.title}"></a>`);
                  }
                  res.write(`</section>`);
                  res.write(`
                  </main><div class="messenger"><a href="#"><img src="https://baasankhuup.github.io/Look-TV/SVG/chat.png" alt="Chat" title="Холбоо барина уу"></a></div><footer><nav class="foot-nav"><article class="footer-nav"><h2 class="footer-package">Багц</h2><p><a class="main-links" href="/HIT">Хит цуврал</a></p><p><a class="main-links" href="/Anime">Аниме</a></p><p><a class="main-links" href="/HBO">HBO олон ангит</a></p><p><a class="main-links" href="/Huuhdiin_Bagts">Хүүхдийн багц</a></p><p><a class="main-links" href="/Oros_Bagts">Орос-Европ багц</a></p></article><article class="footer-nav"><h2 class="footer-help">Тусламж</h2><p><a href="#">Холбоо барих</a></p><p><a href="#">Сошиал хуудас</a></p><p><a href="#">Онлайн хуудас</a></p></article><article class="footer-nav"><h2 class="footer-regist">Бүртгэл</h2><p><a class="main-links" href="/logout">Гарах</a></p><p><a href="#">Нууц үг солих</a></p></article><article class="footer-nav"><h2 class="footer-setting">Тохиргоо</h2><p><a class="main-links" href="/setting">Тохиргоо</a></p><p><a class="main-links" href="/information">Хувийн мэдээлэл</a></p><p><a href="#">Имейл</a></p></article><article class="footer-nav"><h2 class="footer-sale">Урамшуулал</h2><p><a class="main-links" href="/Sale">Байнгын</a></p><p><a class="main-links" href="/Sale">Баяр ёслолын</a></p></article></nav></footer></body></html>
                  `);
                  res.end();
            });
          });
        });
      });
    });
    break
      case "Sale" : res.write('<link rel="stylesheet" href="https://baasankhuup.github.io/Look-TV//CSS/Sale.css">');
      res.statusCode = 200;
      //Hit
      pool.query(`select i.name,i.url,i.title,s.procent, s.duedate from imageurl as i, sale as s where i.size='height' and s.angilal=i.angilal and s.angilal='Hit' limit 4

      `,(err,data)=>{
        res.write(`<section class="section1"> <h1>Хит кино</h1> <h2 class="sale1" style="text-align:left;">10%-ын Урамшуулал</h2> <h3 class="date">2022/03/31</h3>`);
        for(const row of data.rows){
          res.write(`<div><h4 id="titles">${row.name}</h4><a href="${row.name}"><img src="${row.url}" alt="${row.name}" title="${row.title}"></a></div>`);
        }
        res.write(`<button class="prev1">❮</button><button class="next1">❯</button></section>`);
        
      //Anime
      pool.query(`select i.name,i.url,i.title,s.procent, s.duedate from imageurl as i, sale as s where i.size='height' and s.angilal=i.angilal and s.angilal='Anime' limit 4

      `,(err,data)=>{
        res.write(`<section class="section2"> <h1>Аниме</h1> <h2 class="sale2" style="text-align:left;">15%-ын Урамшуулал</h2> <h3 class="date">2022/03/31</h3>`);
        for(const row of data.rows){
          res.write(`<div><h4 id="titles">${row.name}</h4><a href="${row.name}"><img src="${row.url}" alt="${row.name}" title="${row.title}"></a></div>`);
        }
        res.write(`<button class="prev1">❮</button><button class="next1">❯</button></section>`);
        //Орос евро багц
      pool.query(`select i.name,i.url,i.title,s.procent, s.duedate from imageurl as i, sale as s where i.size='height' and s.angilal=i.angilal and s.angilal='oros-euro' limit 4

      `,(err,data)=>{
        res.write(`<section class="section3"> <h1>Орос евро багц</h1> <h2 class="sale3" style="text-align:left;">20%-ын Урамшуулал</h2> <h3 class="date">2022/03/31</h3>`);
        for(const row of data.rows){
          res.write(`<div><h4 id="titles">${row.name}</h4><a href="${row.name}"><img src="${row.url}" alt="${row.name}" title="${row.title}"></a></div>`);
        }
        res.write(`<button class="prev1">❮</button><button class="next1">❯</button></section>`);
        //HBO ОАК
      pool.query(`select i.name,i.url,i.title,s.procent, s.duedate from imageurl as i, sale as s where i.size='height' and s.angilal=i.angilal and s.angilal='OlonAngit' limit 4

      `,(err,data)=>{
        res.write(`<section class="section4"> <h1>HBO Олон ангит кино багц</h1> <h2 class="sale4" style="text-align:left;">25%-ын Урамшуулал</h2> <h3 class="date">2022/03/31</h3>`);
        for(const row of data.rows){
          res.write(`<div><h4 id="titles">${row.name}</h4><a href="${row.name}"><img src="${row.url}" alt="${row.name}" title="${row.title}"></a></div>`);
        }
        res.write(`<button class="prev1">❮</button><button class="next1">❯</button></section>`);
        res.write(`
        </main><div class="messenger"><a href="#"><img src="https://baasankhuup.github.io/Look-TV/SVG/chat.png" alt="Chat" title="Холбоо барина уу"></a></div><footer><nav class="foot-nav"><article class="footer-nav"><h2 class="footer-package">Багц</h2><p><a class="main-links" href="/HIT">Хит цуврал</a></p><p><a class="main-links" href="/Anime">Аниме</a></p><p><a class="main-links" href="/HBO">HBO олон ангит</a></p><p><a class="main-links" href="/Huuhdiin_Bagts">Хүүхдийн багц</a></p><p><a class="main-links" href="/Oros_Bagts">Орос-Европ багц</a></p></article><article class="footer-nav"><h2 class="footer-help">Тусламж</h2><p><a href="#">Холбоо барих</a></p><p><a href="#">Сошиал хуудас</a></p><p><a href="#">Онлайн хуудас</a></p></article><article class="footer-nav"><h2 class="footer-regist">Бүртгэл</h2><p><a class="main-links" href="/logout">Гарах</a></p><p><a href="#">Нууц үг солих</a></p></article><article class="footer-nav"><h2 class="footer-setting">Тохиргоо</h2><p><a class="main-links" href="/setting">Тохиргоо</a></p><p><a class="main-links" href="/information">Хувийн мэдээлэл</a></p><p><a href="#">Имейл</a></p></article><article class="footer-nav"><h2 class="footer-sale">Урамшуулал</h2><p><a class="main-links" href="/Sale">Байнгын</a></p><p><a class="main-links" href="/Sale">Баяр ёслолын</a></p></article></nav></footer></body></html>`);
      
        res.end();
      });
    });
  });
});

      break;
      case "Turees" :
      res.statusCode = 200; 
      res.write('<link rel="stylesheet" href="https://baasankhuup.github.io/Look-TV/CSS/Turees.css">');
      pool.query(`select i.name,i.url,i.title,s.startdate,s.duedate from imageurl i, sungah s where i.name =s.name limit 16`,(err,data)=>{
        res.write(`<div class="round1">`);
        for(const row of data.rows){
          res.write(`
          <div>
            <img src="${row.url}" alt="${row.title}" title="${row.title}">
            <p class="NM"><b>Нэр:</b> ${row.title}</p>
            <p class="ST" style="font-family: 'Russo One', sans-serif;font-size: 15px;"><b>Эхлэх: </b>${row.startdate}</p>
            <p class="DU" style="font-family: 'Russo One', sans-serif;font-size: 15px;"><b>Дуусах: </b> ${row.duedate}</p>
            <form action="/">
              <button class="due">Сунгах</button>
            </form>
          </div>
          `);
        }
        res.write(`</div>`);
        res.write(`
            </main><div class="messenger"><a href="#"><img src="https://baasankhuup.github.io/Look-TV/SVG/chat.png" alt="Chat" title="Холбоо барина уу"></a></div><footer><nav class="foot-nav"><article class="footer-nav"><h2 class="footer-package">Багц</h2><p><a class="main-links" href="/HIT">Хит цуврал</a></p><p><a class="main-links" href="/Anime">Аниме</a></p><p><a class="main-links" href="/HBO">HBO олон ангит</a></p><p><a class="main-links" href="/Huuhdiin_Bagts">Хүүхдийн багц</a></p><p><a class="main-links" href="/Oros_Bagts">Орос-Европ багц</a></p></article><article class="footer-nav"><h2 class="footer-help">Тусламж</h2><p><a href="#">Холбоо барих</a></p><p><a href="#">Сошиал хуудас</a></p><p><a href="#">Онлайн хуудас</a></p></article><article class="footer-nav"><h2 class="footer-regist">Бүртгэл</h2><p><a class="main-links" href="/logout">Гарах</a></p><p><a href="#">Нууц үг солих</a></p></article><article class="footer-nav"><h2 class="footer-setting">Тохиргоо</h2><p><a class="main-links" href="/setting">Тохиргоо</a></p><p><a class="main-links" href="/information">Хувийн мэдээлэл</a></p><p><a href="#">Имейл</a></p></article><article class="footer-nav"><h2 class="footer-sale">Урамшуулал</h2><p><a class="main-links" href="/Sale">Байнгын</a></p><p><a class="main-links" href="/Sale">Баяр ёслолын</a></p></article></nav></footer></body></html>
        `);
        res.end();
      });
    break;
      case "Tv" :
      res.statusCode = 200; 
      res.write(`<link rel="stylesheet" href="https://baasankhuup.github.io/Look-TV/CSS/Tv.css">`);
      res.write(`<h1 id="Movie_title">Кино суваг</h1><section class="Movie_aside">`);
      
      pool.query(`select i.name, i.title,i.url,t.tvurl from imageurl i,tvvideourl t where i.angilal=t.angilal and i.name=t.name and i.angilal='national-channel'`,(err, data)=>{
        res.write(`<div class="Chapt_Tv dialog-National-channel">
        <h2 class="h2_title undsen">Үндсэн сувгууд</h2>
        <i class="fas fa-chevron-circle-up"></i>
        <i class="fas fa-chevron-circle-down"></i><br>`);
        for(const row of data.rows){
          res.write(`<a href="#" onclick="changeSrc('${row.url}','${row.title}')">
          <img src='${row.url}' alt="${row.title}" title="${row.title}" onclick="movieSrc('${row.tvurl}')">
          <p class="name">${row.name}</p>
        </a>`);
        }
        res.write(`</div>`);
        pool.query(`select i.name, i.title,i.url,t.tvurl from imageurl i,tvvideourl t where i.angilal=t.angilal and i.name=t.name and i.angilal='family-package'`,(err, data)=>{
          res.write(`<div class="Chapt_Tv dialog-National-family-package">
          <h2 class="h2_title gerbul">Гэр бүл багц</h2>
          <i class="fas fa-chevron-circle-up"></i>
          <i class="fas fa-chevron-circle-down"></i><br>`);
          for(const row of data.rows){
            res.write(`<a href="#" onclick="changeSrc('${row.url}','${row.title}')">
            <img src='${row.url}' alt="${row.title}" title="${row.title}" onclick="movieSrc('${row.tvurl}')">
            <p class="name">${row.name}</p>
          </a>`);
          }
          res.write(`</div>`);
          pool.query(`select i.name, i.title,i.url,t.tvurl from imageurl i,tvvideourl t where i.angilal=t.angilal and i.name=t.name and i.angilal='national-package'`,(err,data)=>{
            res.write(`<div class="Chapt_Tv dialog-National-package">
            <h2 class="h2_title bagts">Үндсэн багц</h2>
            <i class="fas fa-chevron-circle-up"></i>
            <i class="fas fa-chevron-circle-down"></i>`);
            for(const row of data.rows){
              res.write(`<a href="#" onclick="changeSrc('${row.url}','${row.title}')">
              <img src="${row.url}" alt="${row.title}" title="${row.title}"  onclick="movieSrc('${row.tvurl}')">
              <p class="name">${row.name}</p>
            </a>`);
            }
            res.write('</div>');
            pool.query(`select i.name, i.title,i.url,t.tvurl from imageurl i,tvvideourl t where i.angilal=t.angilal and i.name=t.name and i.angilal='HBO-channel'`,(err,data)=>{
              res.write(`<div class="Chapt_Tv dialog-National-HBO-channel">
              <h2 class="h2_title HBO">HBO сувгууд</h2>
              <i class="fas fa-chevron-circle-up"></i>
              <i class="fas fa-chevron-circle-down"></i><br>`);
              for(const row of data.rows){
                res.write(`<a href="#" onclick="changeSrc('${row.url}','${row.title}')">
                <img src="${row.url}" alt="${row.title}" title="${row.title}" onclick="movieSrc('${row.tvurl}')">
                <p class="name">${row.name}</p>
              </a>`);
              }
              res.write('</div>');
              pool.query(`select i.name, i.title,i.url,t.tvurl from imageurl i,tvvideourl t where i.angilal=t.angilal and i.name=t.name and i.angilal='entertainment-package'`,(err,data)=>{
                res.write(`<div class="Chapt_Tv dialog-entetainment-package">
                <h2 class="h2_title ent">Энтертайнмент Багц</h2>
                <i class="fas fa-chevron-circle-up"></i>
                <i class="fas fa-chevron-circle-down"></i><br>`);
                for(const row of data.rows){
                  res.write(`<a href="#" onclick="changeSrc('${row.url}','${row.title}')">
                  <img src="${row.url}" alt="${row.title}" title="${row.title}" onclick="movieSrc('${row.tvurl}')">
                  <p class="name">${row.name}</p>
                </a>`);
                }
                res.write('</div>');
                pool.query(`select i.name, i.title,i.url,t.tvurl from imageurl i,tvvideourl t where i.angilal=t.angilal and i.name=t.name and i.angilal='sport-package'`,(err,data)=>{
                  res.write(`<div class="Chapt_Tv diaiog-sport-package">
                  <h2 class="h2_title sport">Спорт багц</h2>
                  <i class="fas fa-chevron-circle-up"></i>
                  <i class="fas fa-chevron-circle-down"></i><br>`);
                  for(const row of data.rows){
                    res.write(`<a href="#" onclick="changeSrc('${row.url}','${row.title}')">
                    <img src="${row.url}" alt="${row.title}" title="${row.title}" onclick="movieSrc('${row.tvurl}')">
                    <p class="name">${row.name}</p>
                  </a>`);
                  }
                  res.write('</div>');
                  pool.query(`select i.name, i.title,i.url,t.tvurl from imageurl i,tvvideourl t where i.angilal=t.angilal and i.name=t.name and i.angilal='traffic'`,(err,data)=>{
                    res.write(`<div class="Chapt_Tv dialog-Traffic-channel">
                    <h2 class="h2_title traffic">Traffic-channel</h2>
                    <i class="fas fa-chevron-circle-up"></i>
                    <i class="fas fa-chevron-circle-down"></i>`);
                    for(const row of data.rows){
                      res.write(`<a href="#" onclick="changeSrc('${row.url}','${row.title}')">
                      <img src="${row.url}" alt="${row.title}" title="${row.title}" onclick="movieSrc('${row.tvurl}')">
                      <p class="name">${row.name}</p>
                    </a>`);
                    }
                    res.write('</div></section>');
                    //TV END

                    //epir start
                    res.write(`
                    <div class="Televisiz_epir">
                    <div class="Tv_title">
                      <img src="https://baasankhuup.github.io/Look-TV/tv-img/national-channel/1.png" alt="TV" title="TV" class="tvsChanges">
                      <h2 class="active_date">
                      <span id="hour">16</span>:<span id="minutes">31</span>:<span id="seconds">53</span>
                    </h2>
                    </div>
                      <iframe width="660" height="380" src="https://www.youtube.com/embed/pMEOlQHBXkE" title="Youtube page" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"class="movie"></iframe>
                  </div>
                  <script>
      //Big images slider
      var slideIndex = 1;
      showSlides(slideIndex);
      
      function plusSlides(n) {
        showSlides(slideIndex += n);
      }
      
      function currentSlide(n) {
        showSlides(slideIndex = n);
      }
      
      function showSlides(n) {
        var i;
        var slides = document.getElementsByClassName("mySlides");
        if (n > slides.length) {slideIndex = 1}  
		}

    
    //Tv Change
    function changeSrc(anything,title){
    document.querySelector('.tvsChanges').src = anything;
    document.querySelector('.tvsChanges').title = title;
    console.log(anything);
  }
    function movieSrc(url){
      document.querySelector('.movie').src = url;
      console.log(url);
    }
                  </script>
                  <div class="dialog-date">
          <i class="fas fa-chevron-circle-left"></i>
           <p class="Month_day">12-March-11</p>
           <i class="fas fa-chevron-circle-right"></i>
           <div class="Kino_huviari">
              
      <p class="date-title">08:00:00&nbsp;&nbsp;--&nbsp;&nbsp;<b>Өглөөний хөтөлбөр</b></p>
      <p class="date-title">09:00:00&nbsp;&nbsp;--&nbsp;&nbsp;<b>Хүүхдийн кино</b></p>
      <p class="date-title">10:00:00&nbsp;&nbsp;--&nbsp;&nbsp;<b>Мэдээ</b></p>
      <p class="date-title">11:00:00&nbsp;&nbsp;--&nbsp;&nbsp;<b>Теле хичээл</b></p>
      <p class="date-title">12:00:00&nbsp;&nbsp;--&nbsp;&nbsp;<b>Өдрийн мэндчилгээ</b></p>
      <p class="date-title">13:00:00&nbsp;&nbsp;--&nbsp;&nbsp;<b>Хүүхдийн кино</b></p>
      <p class="date-title">14:00:00&nbsp;&nbsp;--&nbsp;&nbsp;<b>Ая дууны мэндчилгээ</b></p>
      <p class="date-title">15:00:00&nbsp;&nbsp;--&nbsp;&nbsp;<b>Мэдээ</b></p>
      <p class="date-title">16:00:00&nbsp;&nbsp;--&nbsp;&nbsp;<b>Давталт /УСК/</b></p>
      <p class="date-title">17:00:00&nbsp;&nbsp;--&nbsp;&nbsp;<b>Зар сурталчилгаа</b></p>
      <p class="date-title">18:00:00&nbsp;&nbsp;--&nbsp;&nbsp;<b>ОАК</b></p>
      <p class="date-title">19:00:00&nbsp;&nbsp;--&nbsp;&nbsp;<b>Мэдээ</b></p>
      <p class="date-title">20:00:00&nbsp;&nbsp;--&nbsp;&nbsp;<b>Зар сурталчилгаа</b></p>
      <p class="date-title">21:00:00&nbsp;&nbsp;--&nbsp;&nbsp;<b>Нэвтрүүлэг</b></p>
      <p class="date-title">22:00:00&nbsp;&nbsp;--&nbsp;&nbsp;<b>УСК</b></p>
      <p class="date-title">23:00:00&nbsp;&nbsp;--&nbsp;&nbsp;<b>Дууны цаг</b></p>
           </div>
         </div>
                   
                    </main><div class="messenger"><a href="#"><img src="https://baasankhuup.github.io/Look-TV/SVG/chat.png" alt="Chat" title="Холбоо барина уу"></a></div><footer><nav class="foot-nav"><article class="footer-nav"><h2 class="footer-package">Багц</h2><p><a class="main-links" href="/HIT">Хит цуврал</a></p><p><a class="main-links" href="/Anime">Аниме</a></p><p><a class="main-links" href="/HBO">HBO олон ангит</a></p><p><a class="main-links" href="/Huuhdiin_Bagts">Хүүхдийн багц</a></p><p><a class="main-links" href="/Oros_Bagts">Орос-Европ багц</a></p></article><article class="footer-nav"><h2 class="footer-help">Тусламж</h2><p><a href="#">Холбоо барих</a></p><p><a href="#">Сошиал хуудас</a></p><p><a href="#">Онлайн хуудас</a></p></article><article class="footer-nav"><h2 class="footer-regist">Бүртгэл</h2><p><a class="main-links" href="/logout">Гарах</a></p><p><a href="#">Нууц үг солих</a></p></article><article class="footer-nav"><h2 class="footer-setting">Тохиргоо</h2><p><a class="main-links" href="/setting">Тохиргоо</a></p><p><a class="main-links" href="/information">Хувийн мэдээлэл</a></p><p><a href="#">Имейл</a></p></article><article class="footer-nav"><h2 class="footer-sale">Урамшуулал</h2><p><a class="main-links" href="/Sale">Байнгын</a></p><p><a class="main-links" href="/Sale">Баяр ёслолын</a></p></article></nav></footer>
                  </body></html>`);
                  });
                });
              });
            });
          });
        });
      });
break;
      case "HIT": 
        res.statusCode = 200; 
      res.write('<link rel="stylesheet" href="https://baasankhuup.github.io/Look-TV//CSS/Bagts.css">');
      pool.query(`SELECT * FROM "imageurl" where size='height' and angilal='Hit'`, (err, data)=>{
        res.write(`<section class="HIT-Movie">
        <h1>Хит кино</h1>`);
        for(const row of data.rows)
        {
          res.write(`<a href=#><img src="${row.url}" title="${row.title}" alt="${row.title}"></a>`);
        }
        res.write(`</section>`);
        res.write(`
        </main><div class="messenger"><a href="#"><img src="https://baasankhuup.github.io/Look-TV/SVG/chat.png" alt="Chat" title="Холбоо барина уу"></a></div><footer><nav class="foot-nav"><article class="footer-nav"><h2 class="footer-package">Багц</h2><p><a class="main-links" href="/HIT">Хит цуврал</a></p><p><a class="main-links" href="/Anime">Аниме</a></p><p><a class="main-links" href="/HBO">HBO олон ангит</a></p><p><a class="main-links" href="/Huuhdiin_Bagts">Хүүхдийн багц</a></p><p><a class="main-links" href="/Oros_Bagts">Орос-Европ багц</a></p></article><article class="footer-nav"><h2 class="footer-help">Тусламж</h2><p><a href="#">Холбоо барих</a></p><p><a href="#">Сошиал хуудас</a></p><p><a href="#">Онлайн хуудас</a></p></article><article class="footer-nav"><h2 class="footer-regist">Бүртгэл</h2><p><a class="main-links" href="/logout">Гарах</a></p><p><a href="#">Нууц үг солих</a></p></article><article class="footer-nav"><h2 class="footer-setting">Тохиргоо</h2><p><a class="main-links" href="/setting">Тохиргоо</a></p><p><a class="main-links" href="/information">Хувийн мэдээлэл</a></p><p><a href="#">Имейл</a></p></article><article class="footer-nav"><h2 class="footer-sale">Урамшуулал</h2><p><a class="main-links" href="/Sale">Байнгын</a></p><p><a class="main-links" href="/Sale">Баяр ёслолын</a></p></article></nav></footer></body></html>
        `);
        res.end();
      });
      
        break; 
      case "Anime": 
        res.statusCode = 200;
      res.write('<link rel="stylesheet" href="https://baasankhuup.github.io/Look-TV//CSS/Bagts.css">');
      pool.query(`SELECT * FROM "imageurl" where size='height' and angilal='Anime'`, (err, data)=>{
        res.write(`<section class="HIT-Movie" style="text-align:left">
        <h1>Аниме</h1>`);
        for(const row of data.rows)
        {
          res.write(`<a href=#><img src="${row.url}" title="${row.title}" alt="${row.title}"></a>`);
        }
        res.write(`</section>`);
        res.write(`
        </main><div class="messenger"><a href="#"><img src="https://baasankhuup.github.io/Look-TV/SVG/chat.png" alt="Chat" title="Холбоо барина уу"></a></div><footer><nav class="foot-nav"><article class="footer-nav"><h2 class="footer-package">Багц</h2><p><a class="main-links" href="/HIT">Хит цуврал</a></p><p><a class="main-links" href="/Anime">Аниме</a></p><p><a class="main-links" href="/HBO">HBO олон ангит</a></p><p><a class="main-links" href="/Huuhdiin_Bagts">Хүүхдийн багц</a></p><p><a class="main-links" href="/Oros_Bagts">Орос-Европ багц</a></p></article><article class="footer-nav"><h2 class="footer-help">Тусламж</h2><p><a href="#">Холбоо барих</a></p><p><a href="#">Сошиал хуудас</a></p><p><a href="#">Онлайн хуудас</a></p></article><article class="footer-nav"><h2 class="footer-regist">Бүртгэл</h2><p><a class="main-links" href="/logout">Гарах</a></p><p><a href="#">Нууц үг солих</a></p></article><article class="footer-nav"><h2 class="footer-setting">Тохиргоо</h2><p><a class="main-links" href="/setting">Тохиргоо</a></p><p><a class="main-links" href="/information">Хувийн мэдээлэл</a></p><p><a href="#">Имейл</a></p></article><article class="footer-nav"><h2 class="footer-sale">Урамшуулал</h2><p><a class="main-links" href="/Sale">Байнгын</a></p><p><a class="main-links" href="/Sale">Баяр ёслолын</a></p></article></nav></footer></body></html>
        `);
        res.end();
      });
        break;
      case "HBO": 
        res.statusCode = 200;
      res.write('<link rel="stylesheet" href="https://baasankhuup.github.io/Look-TV//CSS/Bagts.css">');
      pool.query(`select * from imageurl where angilal='OlonAngit'`, (err, data)=>{
        res.write(`<section class="HIT-Movie" style="text-align:left">
        <h1>HBO</h1>`);
        for(const row of data.rows)
        {
          res.write(`<a href=#><img src="${row.url}" title="${row.title}" alt="${row.title}"></a>`);
        }
        res.write(`</section>`);
        res.write(`
        </main><div class="messenger"><a href="#"><img src="https://baasankhuup.github.io/Look-TV/SVG/chat.png" alt="Chat" title="Холбоо барина уу"></a></div><footer><nav class="foot-nav"><article class="footer-nav"><h2 class="footer-package">Багц</h2><p><a class="main-links" href="/HIT">Хит цуврал</a></p><p><a class="main-links" href="/Anime">Аниме</a></p><p><a class="main-links" href="/HBO">HBO олон ангит</a></p><p><a class="main-links" href="/Huuhdiin_Bagts">Хүүхдийн багц</a></p><p><a class="main-links" href="/Oros_Bagts">Орос-Европ багц</a></p></article><article class="footer-nav"><h2 class="footer-help">Тусламж</h2><p><a href="#">Холбоо барих</a></p><p><a href="#">Сошиал хуудас</a></p><p><a href="#">Онлайн хуудас</a></p></article><article class="footer-nav"><h2 class="footer-regist">Бүртгэл</h2><p><a class="main-links" href="/logout">Гарах</a></p><p><a href="#">Нууц үг солих</a></p></article><article class="footer-nav"><h2 class="footer-setting">Тохиргоо</h2><p><a class="main-links" href="/setting">Тохиргоо</a></p><p><a class="main-links" href="/information">Хувийн мэдээлэл</a></p><p><a href="#">Имейл</a></p></article><article class="footer-nav"><h2 class="footer-sale">Урамшуулал</h2><p><a class="main-links" href="/Sale">Байнгын</a></p><p><a class="main-links" href="/Sale">Баяр ёслолын</a></p></article></nav></footer></body></html>
        `);
        res.end();
      });
        break;
      case "Huuhdiin_Bagts": 
        res.statusCode = 200;
      res.write('<link rel="stylesheet" href="https://baasankhuup.github.io/Look-TV//CSS/Bagts.css">');
      pool.query(`select * from imageurl where angilal='Child'`, (err, data)=>{
        res.write(`<section class="HIT-Movie" style="text-align:left">
        <h1>Хүүхдийн кино</h1>`);
        for(const row of data.rows)
        {
          res.write(`<a href=#><img src="${row.url}" title="${row.title}" alt="${row.title}"></a>`);
        }
        res.write(`</section>`);
        res.write(`
        </main><div class="messenger"><a href="#"><img src="https://baasankhuup.github.io/Look-TV/SVG/chat.png" alt="Chat" title="Холбоо барина уу"></a></div><footer><nav class="foot-nav"><article class="footer-nav"><h2 class="footer-package">Багц</h2><p><a class="main-links" href="/HIT">Хит цуврал</a></p><p><a class="main-links" href="/Anime">Аниме</a></p><p><a class="main-links" href="/HBO">HBO олон ангит</a></p><p><a class="main-links" href="/Huuhdiin_Bagts">Хүүхдийн багц</a></p><p><a class="main-links" href="/Oros_Bagts">Орос-Европ багц</a></p></article><article class="footer-nav"><h2 class="footer-help">Тусламж</h2><p><a href="#">Холбоо барих</a></p><p><a href="#">Сошиал хуудас</a></p><p><a href="#">Онлайн хуудас</a></p></article><article class="footer-nav"><h2 class="footer-regist">Бүртгэл</h2><p><a class="main-links" href="/logout">Гарах</a></p><p><a href="#">Нууц үг солих</a></p></article><article class="footer-nav"><h2 class="footer-setting">Тохиргоо</h2><p><a class="main-links" href="/setting">Тохиргоо</a></p><p><a class="main-links" href="/information">Хувийн мэдээлэл</a></p><p><a href="#">Имейл</a></p></article><article class="footer-nav"><h2 class="footer-sale">Урамшуулал</h2><p><a class="main-links" href="/Sale">Байнгын</a></p><p><a class="main-links" href="/Sale">Баяр ёслолын</a></p></article></nav></footer></body></html>
        `);
        res.end();
      });
        break;
      case "Oros_Bagts": 
        res.statusCode = 200;
      res.write('<link rel="stylesheet" href="https://baasankhuup.github.io/Look-TV//CSS/Bagts.css">');
      pool.query(`select * from imageurl where angilal='oros-euro'`, (err, data)=>{
        res.write(`<section class="HIT-Movie" style="text-align:left">
        <h1>Орос-Евро</h1>`);
        for(const row of data.rows)
        {
          res.write(`<a href=#><img src="${row.url}" title="${row.title}" alt="${row.title}"></a>`);
        }
        res.write(`</section>`);
        res.write(`
        </main><div class="messenger"><a href="#"><img src="https://baasankhuup.github.io/Look-TV/SVG/chat.png" alt="Chat" title="Холбоо барина уу"></a></div><footer><nav class="foot-nav"><article class="footer-nav"><h2 class="footer-package">Багц</h2><p><a class="main-links" href="/HIT">Хит цуврал</a></p><p><a class="main-links" href="/Anime">Аниме</a></p><p><a class="main-links" href="/HBO">HBO олон ангит</a></p><p><a class="main-links" href="/Huuhdiin_Bagts">Хүүхдийн багц</a></p><p><a class="main-links" href="/Oros_Bagts">Орос-Европ багц</a></p></article><article class="footer-nav"><h2 class="footer-help">Тусламж</h2><p><a href="#">Холбоо барих</a></p><p><a href="#">Сошиал хуудас</a></p><p><a href="#">Онлайн хуудас</a></p></article><article class="footer-nav"><h2 class="footer-regist">Бүртгэл</h2><p><a class="main-links" href="/logout">Гарах</a></p><p><a href="#">Нууц үг солих</a></p></article><article class="footer-nav"><h2 class="footer-setting">Тохиргоо</h2><p><a class="main-links" href="/setting">Тохиргоо</a></p><p><a class="main-links" href="/information">Хувийн мэдээлэл</a></p><p><a href="#">Имейл</a></p></article><article class="footer-nav"><h2 class="footer-sale">Урамшуулал</h2><p><a class="main-links" href="/Sale">Байнгын</a></p><p><a class="main-links" href="/Sale">Баяр ёслолын</a></p></article></nav></footer></body></html>
        `);
        res.end();
      });
        break;
        default: 
          res.statusCode = 404;
        res.write(`<h1 class="NotPage">Ийм хуудас байхгүй байна</h1>
        <style>
          .NotPage{
            background: black;
            color:white;
            text-align: center;
            margin-top:200px;
            z-index:1000
          }
        </style>`);


        res.write(`
          </main><div class="messenger"><a href="#"><img src="https://baasankhuup.github.io/Look-TV/SVG/chat.png" alt="Chat" title="Холбоо барина уу"></a></div><footer><nav class="foot-nav"><article class="footer-nav"><h2 class="footer-package">Багц</h2><p><a class="main-links" href="/HIT">Хит цуврал</a></p><p><a class="main-links" href="/Anime">Аниме</a></p><p><a class="main-links" href="/HBO">HBO олон ангит</a></p><p><a class="main-links" href="/Huuhdiin_Bagts">Хүүхдийн багц</a></p><p><a class="main-links" href="/Oros_Bagts">Орос-Европ багц</a></p></article><article class="footer-nav"><h2 class="footer-help">Тусламж</h2><p><a href="#">Холбоо барих</a></p><p><a href="#">Сошиал хуудас</a></p><p><a href="#">Онлайн хуудас</a></p></article><article class="footer-nav"><h2 class="footer-regist">Бүртгэл</h2><p><a class="main-links" href="/logout">Гарах</a></p><p><a href="#">Нууц үг солих</a></p></article><article class="footer-nav"><h2 class="footer-setting">Тохиргоо</h2><p><a class="main-links" href="/setting">Тохиргоо</a></p><p><a class="main-links" href="/information">Хувийн мэдээлэл</a></p><p><a href="#">Имейл</a></p></article><article class="footer-nav"><h2 class="footer-sale">Урамшуулал</h2><p><a class="main-links" href="/Sale">Байнгын</a></p><p><a class="main-links" href="/Sale">Баяр ёслолын</a></p></article></nav></footer></body></html>
        `); 
        res.end();
        break;
  }
//#endregion End
});
server.listen(port, () => {
  console.log(`Server running at http://${port}`);
});


