//BCLib JavaScript Library
//by pixels4tech@gmail.com

document.body.style.fontFamily = "sans-serif"
document.body.style.backgroundImage = "url('images/bg.png')"
document.body.style.backgroundRepeat = "no-repeat"

try{
      document.querySelector("style").innerHTML += "*{cursor: url(\"images/cursor.cur\"), default;}"
}catch(e){
      document.head.innerHTML += "<style></style>";
      document.querySelector("style").innerHTML += "*{cursor: url(\"images/cursor.cur\"), default;}"
}
if(!desktop) document.body.innerHTML += "<div id='desktop'></div>";
if(!windows) document.body.innerHTML += "<div id='windows'></div>";

var bclib = {
      CLI: {
        createCLIWindow: function(t, state){
          createWindow(t, "<div id='clishell' style='background: black; color: white; font-family: Courier, monospace; "+ (state ? "width: 300px; height: 200px;" : "") + "'></div>")
        },
        echo: function(txt){
          clishell.innerHTML += txt+"<br>"
        },
        clear: function(){
          clishell.innerHTML = ""
        },
        input: function(todo){
          clishell.innerHTML += "<input type='text' id='inp' style='color: white; background: black; font-family: monospace;'><br><button style='color: white; background: black;' onclick='bclib.temp.inputValue = inp.value; "+todo+"'>OK</button><br>"
        }
      },
      util: {
        utilmgr: function(object){
          createWindow("Utility Manager", "<input type='text' id='obj' placeholder='Адрес объекта' value='bclib.util'> <button id='ok'>OK</button><hr style='margin:0px;'><div id='list'></div><input type='text' id='params' placeholder='Параметры'>")

          ok.onclick = function(){
            list.innerHTML = ""
            for(var i in eval(obj.value)){
                if(typeof(eval(obj.value)[i]) == "function"){
                    list.innerHTML += "<img src='images/run.png' width=16 height=16> <code onclick='eval(\""+obj.value+"."+i+"(\"+params.value+\")"+"\")'>" + i +"</code><hr style='margin:0px;'>"
                }
            }
          }

          if(object){
            obj.value = object
            ok.click()
          }
        },
        yedit: function(object){
          createWindow("YEditor", "<input type='text' id='obj' placeholder='Адрес объекта' value='bclib.util'> <button id='ok'>OK</button><hr style='margin:0px;'><div id='list'></div><button id='del'>Удалить</button> <button id='_new'>Создать</button>")

          ok.onclick = function(){
            list.innerHTML = ""
            for(var i in eval(obj.value)){
                list.innerHTML += "<img src='images/file-js.png' width=16 height=16> <code onclick='bclib.util.edit(\""+obj.value+"."+i+"\")'>" + i +"</code><hr style='margin:0px;'>"
            }
          }

          del.onclick = function(){
            createWindow("Удалить", "<input id='todel'> <button id='okdel'>OK</button>")
            okdel.onclick = ()=>{eval("delete " + obj.value + "." + todel.value)}
          }

          _new.onclick = function(){
            createWindow("Создать", "<input id='tonew'> <button id='oknew'>OK</button>")
            oknew.onclick = ()=>{eval(obj.value + "." + tonew.value + " = ''")}
          }

          if(object){
            obj.value = object
            ok.click()
          }
        },
        run: function(tr){
          try{
            return eval(tr)
          }catch(e){
            return e
          }
        },
        close: function(){
          windows.innerHTML = ""
        },
        reboot: function(){
          window.location.reload()
        },
        showMessage: function(title, text, btn, click){
          createWindow(title, text + "<br><button onclick='"+click+"'>"+btn+"</button>")
        },
        addApp: function(file, url, width, height){
          localStorage[file] = "createWindow('"+file+"', '<iframe style=\"overflow: auto; resize: both;\" src=\""+url+"\" width="+width+" height="+height+"></iframe>')"
        },
        openPage: function(page){
          createWindow(page, "<iframe style='overflow: auto; resize: both;' src='"+page+"' width=400 height=300></iframe>")
        },
        mediaplayer: function(file, state){
          var fileJSON = JSON.parse(localStorage[file])
          if(state == "get"){
            return fileJSON
          }
          var out = "<h1>Error</h1>Incorrect mediafile."
          switch(fileJSON.type){
          case("video"):
          out = "<video width="+fileJSON.width+" height="+fileJSON.height+" src='"+fileJSON.link+"' controls></video>"
          createWindow(file + " - Mediaplayer", out)
          break
          case("audio"):
          out = "<audio width="+fileJSON.width+" height="+fileJSON.height+" src='"+fileJSON.link+"' controls></audio>"
          break
          case("image"):
          out = "<img width="+fileJSON.width+" height="+fileJSON.height+" src='"+fileJSON.link+"'>"
          createWindow(file + " - Mediaplayer", out)
          break
          case("canvas"):
          out = "<canvas id='cnv' width="+fileJSON.width+" height="+fileJSON.height+" ></canvas>"
          createWindow(file + " - Mediaplayer", out)
          bclib.temp.ctx = document.getElementById("cnv").getContext("2d")
          eval(fileJSON.code)
          break
          }

        },
        varexp: function(obj){
          createWindow("Variables Explorer", "<div id='varexp' style='color: white; background: black; font-family: monospace;'></div>")
          varexp.innerHTML += "Name&nbsp;&nbsp;&nbsp;Type&nbsp;&nbsp;&nbsp;Value<br><br>"
          var value = ""
          for(var i in window[obj]){
            switch(typeof(window[obj][i])){
            case("object"):
              value = Object.keys(window[obj][i]).join(", ")
              break
            case("function"):
              break
            default:
              value = window[obj][i]
            }
          varexp.innerHTML += (i + "&nbsp;&nbsp;&nbsp;" + typeof(window[obj][i]) + "&nbsp;&nbsp;&nbsp;" + value + "<br>")
          }
        },
        cmd: function(state){
          bclib.CLI.createCLIWindow('Системная консоль', state); bclib.CLI.input('bclib.CLI.echo(bclib.util.run(bclib.temp.inputValue))')
        },
        taskmgr: function(){
          taskmgr.click()
        },
        filemgr: function(){
          var systxt = "<details><summary><code title='Системные файлы и библиотеки (*.sys, *.lib, *.bc)'>Система</code></summary>"
        var progtxt = "<details><summary><code title='Программы и файлы программ (*.js, *.json, *.func)'>Программы</code></summary>"
        var txt = ""
        var file = ""
        var title = ""
        var isSF = false
        for(var i in localStorage){
          var click = "bclib.util.file.edit(\""+i+"\")"
          var rclick = click
          if(i.slice(0, 7) == "hidden:"){
            continue
          }else if(i.slice(i.length-3) == ".js"){
            file = "run.png"
            title = "Программа JavaScript (*.js)"
            click="try{eval(localStorage[\""+i+"\"])}catch(e){createWindow(\"Error\", e)}"
          }else if(i.slice(i.length-5) == ".prog" || i.slice(i.length-4) == ".app"){
            file = "run.png"
            title = "Приложение (*.prog, *.app)"
            click="try{eval(localStorage[\""+i+"\"])}catch(e){createWindow(\"Error\", e)}"
            rclick=""
          }else if(i.slice(i.length-5) == ".html" || i.slice(i.length-4) == ".htm"){
            file = "file-html.png"
            title = "HTML - страница (*.htm, *.html)"
            click="bclib.util.file.open(\""+i+"\")"
            rclick="bclib.util.file.edit(\""+i+"\", true)"
          }else if(i.slice(i.length-4) == ".sys"){
            file = "file-sys.png"
            title = "Системный файл (*.sys)"
          }else if(i.slice(i.length-5) == ".func"){
            file = "file-js.png"
            title = "Функция (*.func)"
          }else if(i.slice(i.length-5) == ".json"){
            file = "file-js.png"
            title = "JSON - файл (*.json)"
            //click=""
            //rclick=""
          }else if(i.slice(i.length-4) == ".lib"){
            file = "file-sys.png"
            title = "Библиотека (*.lib)"
          }else if(i.slice(i.length-4) == ".txt"){
            file = "file.png"
            title = "Текстовый файл (*.txt)"
          }else if(i.slice(i.length-3) == ".bc"){
            file = "file-sys.png"
            title = "Системная программа (*.bc)"
            click="eval(localStorage[\""+i+"\"])"
            //rclick=""
          }else if(i.slice(i.length-4) == ".mlf"){
            file = "file.png"
            title = "Mediaplayer Link File"
            click="bclib.util.mediaplayer(\""+i+"\")"
          }else{
            switch(i){
              case "key":
              case "length":
              case "getItem":
              case "setItem":
              case "removeItem":
              case "clear":
                continue
                break
              default:
                file = "file.png"
                title = "Файл (*.*)"
            }
          }
          if(file == "file-sys.png"){
            systxt += "<img src='images/"+file+"' width=16 height=16><code title='"+title+"' oncontextmenu=\'"+rclick+"; return false;\' onclick=\'"+click+"\' >" + i + "</code><hr style='margin: 0px;'>"
          }else if(file == "file-js.png" || file == "run.png"){
            progtxt += "<img src='images/"+file+"' width=16 height=16><code title='"+title+"' oncontextmenu=\'"+rclick+"; return false;\' onclick=\'"+click+"\' >" + i + "</code><hr style='margin: 0px;'>"
          }else{
            txt += "<img src='images/"+file+"' width=16 height=16><code title='"+title+"' oncontextmenu=\'"+rclick+"; return false;\' onclick='"+click+"' >" + i + "</code><hr style='margin: 0px;'>"
          }
        }
      createWindow("localStorage", systxt + "</details><hr style='margin: 0px;'>" +progtxt + "</details><hr style='margin: 0px;'>" + txt + "<button onclick='bclib.temp.del()'>Удалить файл</button> <button onclick='bclib.temp.new()'>Новый файл</button>")
        bclib.temp.del = function(){
          createWindow("Удалить","<input id='todel'> <button onclick='bclib.temp.deletedFiles[todel.value] = localStorage[todel.value]; delete localStorage[todel.value]'>OK</button>")
        }
        bclib.temp.new = function(){
          createWindow("Создать","<input id='fn'> <button onclick='bclib.file.write(fn.value, \"\")'>OK</button>")
        }
        },
        edit: function(v){
          createWindow(v, "<textarea id=TA>"+eval(v)+"</textarea><br><button id=BTN>OK</button>")
          BTN.onclick = ()=>{eval(v + " = " + "'" + TA.value + "'")}
        },
        ythemer: function(){
          createWindow("YThemer", "\
          <fieldset><legend>Фон</legend>\
          <input id='clr' type='color' value='#ff0000'><button onclick='bclib.temp.chclr()' style='float: right;'>OK</button></fieldset>\
          <fieldset><legend>Окна</legend>\
          <div style='clear: both;'>windowStyle <button style='float: right;' onclick='bclib.util.edit(`bclib.temp.windowStyle`)'>Открыть</button></div>\
          <div style='clear: both;'>windowHeaderStyle <button style='float: right;' onclick='bclib.util.edit(`bclib.temp.windowHeaderStyle`)'>Открыть</button></div>\
          <div style='clear: both;'>closeButtonStyle <button style='float: right;' onclick='bclib.util.edit(`bclib.temp.closeButtonStyle`)'>Открыть</button></div>\
          <div style='clear: both;'>closeButtonText <button style='float: right;' onclick='bclib.util.edit(`bclib.temp.closeButtonText`)'>Открыть</button></div></fieldset>");
          
          bclib.temp.chclr = function(){
          delete document.body.style.backgroundImage;
          document.body.style.background = clr.value;
          }
        },
      },
        file: {
          write: function(filename, text){
            localStorage[filename] = text
          },
          add: function(filename, text){
            localStorage[filename] += text
          },
          read: function(filename){
            return localStorage[filename]
          },
          edit: function(filename, state){
            if(state){
              createWindow(filename, "<div id=TA contenteditable style=\"outline: none;\">" + localStorage[filename] + "</div><hr style=\"margin: 0px;\"><button id=BTN>OK</button>")
            }else{
              createWindow(filename, "<textarea id=TA>"+localStorage[filename]+"</textarea><br><button id=BTN>OK</button>")
            }
            BTN.onclick = ()=>{localStorage[filename] = TA.value || TA.innerHTML}
          },
          run: function(filename){
            try{
              return eval(localStorage[filename])
            }catch(e){
              return e
            }
          },
          delete: function(filename){
            delete localStorage[filename]
          },
          download: function(filename, link){
            var xmlhttp = new XMLHttpRequest()
            var ret = "Загружено с " + link + " в " + filename
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    localStorage[filename] =  xmlhttp.responseText
                }
            }
            try{
                  xmlhttp.open("GET", link, true)
                  xmlhttp.send()
            }catch(e){
                  ret = "Ошибка: " + e
            }
            return ret
          },
          open: function(filename){
            createWindow(filename, "<div>" + bclib.util.file.read(filename) + "</div>")
          }
        },
      temp: {
        windowStyle: "overflow: auto; resize: both; background: white; display: inline-block; border: solid 1px black; position: absolute;",
        closeButtonStyle: "float: right; background: white; border: solid 1px black;",
        windowHeaderStyle: "",
        
        closeButtonText: " X ",    
        
        deletedFiles: {}

      },
      themes: {
            normal: function(){
                 bclib.temp.windowStyle = "overflow: auto; resize: both; background: white; display: inline-block; border: solid 1px black; position: absolute;",
                 bclib.temp.closeButtonStyle = "float: right; background: white; border: solid 1px black;",
                 bclib.temp.windowHeaderStyle = "",
                 createWindow("", "<h1>Done.</h1>");
            },
            dark: function(){
                 delete document.body.style.backgroundImage;
                 document.body.style.background = "#000000";
                 bclib.temp.closeButtonStyle = "float: right; background: black; color: white; border: solid 1px white;";
                 bclib.temp.windowStyle += "background: black; color: white; border: solid 1px white;";
                 bclib.util.close();
                 createWindow("", "<h1>Done.</h1>"); 
            },
            winxp: function(){
                  bclib.temp.windowStyle = "overflow: auto; resize: both; background: white; display: inline-block; border: solid 2px blue; margin: 2px; position: absolute; border-radius: 5px;",
                  bclib.temp.closeButtonStyle = "float: right; background: red; color: white; padding-left: 5px; padding-right: 5px; font-weight: bold; border-radius: 5px;",
                  bclib.temp.windowHeaderStyle = "background: blue; color: white;"
            },
            secret: function(){
                  delete document.body.style.backgroundImage;
                  document.body.style.background = "#39ff14";
                  document.body.style.fontFamily = "Comic Sans MS, Comic Sans, cursive";
                  bclib.temp.windowHeaderStyle = "background: green; color: deepPink; font-size: 300%;";
                  bclib.temp.closeButtonStyle = "float: right; background: aqua; font-size: 100%;"
                  bclib.temp.closeButtonText = " # ";
                  bclib.temp.windowStyle += "background: red; color: blue;"
                  bclib.util.close();
                  createWindow("", "<h1>Done.</h1>"); 
            }
      },
      desktop: function(){
        desktop.innerHTML += "\
        <img src='images/folder.png' width=50 height=50 onclick='bclib.util.filemgr()'><br><span style='color: white'>Файловый<br>менеджер</span><br><br>\
        <img src='images/cmd.png' width=50 height=50 onclick='bclib.util.cmd(1)'><br><span style='color: white'>Командная<br>строка</span><br><br>"
      },
      json: {},
      task: {},
      version: "BCLib v4.5.2 (27.11.2021)",
      ver: 4.5
  }
var wnd = 0
      function createWindow(title, html){
        wnd++
        var left = Math.floor(Math.random()*(window.innerWidth - 450))
        var top = Math.floor(Math.random()*(window.innerHeight - 450))
        windows.innerHTML += "<div draggable='true' id='w"+wnd+"' style='"+bclib.temp.windowStyle+"'> <div id='header' style='"+bclib.temp.windowHeaderStyle+"'>" +
        title + " <button onclick='windows.removeChild(document.getElementById(\"w"+wnd+"\")); delete bclib.task[\""+title+"\"]' title=\"Закрыть\" style='"+bclib.temp.closeButtonStyle+"'>" + bclib.temp.closeButtonText + "</button></div> " +
          "<hr style='margin: 0px; clear: both; background: black;'>" + html + "</div>"
        document.getElementById("w"+wnd).style.left = left+"px"
        document.getElementById("w"+wnd).style.top = top+"px"
        document.getElementById("w"+wnd).ondragend = function(e){
          e.preventDefault()
          var dx = e.pageX
          var dy = e.pageY
          document.getElementById("w"+wnd).style.left = dx+"px"
          document.getElementById("w"+wnd).style.top = dy+"px"
          //console.log(dx+" "+dy)
          //console.log(document.getElementById("w"+window.wnd)+" "+document.getElementById("w"+window.wnd))
        }
        document.getElementById("w"+wnd).ondrag = function(e){
          e.preventDefault()
        }
        bclib.task[title] = {
          name: title,
          onclose: 'windows.removeChild(document.getElementById("w'+wnd+'")); delete bclib.task["'+title+'"]'
        }

      }

bclib.util.tmp = bclib.temp;
bclib.util.file = bclib.file;
if(localStorage["autorun.bc"]) bclib.file.run("autorun.bc");

window.oncontextmenu = ()=>{return false}
window.ondragover = (e)=>{e.preventDefault()}
