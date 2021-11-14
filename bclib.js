//BCLib JavaScript Library
//by pixels4tech@gmail.com

document.body.style.fontFamily = "sans-serif"
document.body.style.backgroundImage = "url('images/bg.png')"
document.body.style.backgroundRepeat = "no-repeat"
document.querySelector("style").innerHTML += "*{cursor: url(\"images/cursor.cur\"), default;}"

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
      createWindow("localStorage", systxt + "</details><hr style='margin: 0px;'>" +progtxt + "</details><hr style='margin: 0px;'>" + txt + "<button onclick='window.del()'>Удалить файл</button> <button onclick='window.run()'>Запустить скрипт</button>")
        window.del = function(){
          createWindow("Удалить","<input id='todel'> <button onclick='bclib.temp.deletedFiles[todel.value] = localStorage[todel.value]; delete localStorage[todel.value]'>OK</button>")
        }
        window.run = function(){
          createWindow("Запустить","<input id='torun'> <button onclick='bclib.temp.torun = torun.value; bclib.util.close(); try{eval(localStorage[bclib.temp.torun])}catch(e){createWindow(\"Error\", e)}; delete bclib.temp.torun'>OK</button>")
        }
        },
        edit: function(v){
          createWindow(v, "<textarea id=TA>"+eval(v)+"</textarea><br><button id=BTN>OK</button>")
          BTN.onclick = ()=>{eval(v + " = " + "'" + TA.value + "'")}
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
      },
      temp: {
        //Windows XP style:
        /*windowStyle: "overflow: auto; resize: both; background: white; display: inline-block; border: solid 2px blue; margin: 2px; position: absolute; border-radius: 5px;",
        closeButtonStyle: "float: right; background: red; color: white; padding-left: 5px; padding-right: 5px; font-weight: bold; border-radius: 5px;",
        windowHeaderStyle: "background: blue; color: white;",*/

        //Normal style:
        windowStyle: "overflow: auto; resize: both; background: white; display: inline-block; border: solid 1px black; position: absolute;",
        closeButtonStyle: "float: right; background: white; border: solid 1px black;",
        windowHeaderStyle: "",
        
        closeButtonText: " X ",    
        
        deletedFiles: {}

      },
      desktop: function(){
        desktop.innerHTML += "\
        <img src='images/folder.png' width=50 height=50 onclick='bclib.util.filemgr()'><br><span style='color: white'>Файловый<br>менеджер</span><br><br>\
        <img src='images/cmd.png' width=50 height=50 onclick='bclib.util.cmd(1)'><br><span style='color: white'>Командная<br>строка</span><br><br>"
      },
      json: {},
      task: {},
      version: "BCLib v4.3.5"
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
window.oncontextmenu = ()=>{return false}
window.ondragover = (e)=>{e.preventDefault()}
