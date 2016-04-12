const http = require("http");

const fs = require("fs");

const path=require("path");

const mime=require("mime");


var  cache ={};

const hostname = "127.0.0.1";

const port = 3000;


var send404=(response)=>{
	response.writeHead(404,{"Content-Type":"text/plain"});
	response.write("error:404");
	response.end()
}

var sendFile=(response,filePath,fileContents)=>{
	response.writeHead(200,{"Content-Type":mime.lookup(path.basename(filePath))});
	response.end(fileContents)
}

var serveStatic=(response,cache,absPath)=>{
	if(cache[absPath]){
		sendFile(response,absPath,cache[absPath]);
	}else{
		fs.exists(absPath,(exists)=>{
			if(exists){
				fs.readFile(absPath,(err,data)=>{
					if(err){
						send404(response);
					}else{
						cache[absPath]=data;
						sendFile(response,absPath,data)
					}

				})
			}else{
				send404(response);
			}
		})
	}
}

var server = http.createServer((req,res) =>{
	var filePath =false;
	if(req.url=='/'){
		filePath='public/index.html'
	}else{
		filePath='public'+req.url
	}
	var absPath='./'+filePath;
	serveStatic(res,cache,absPath)
});

server.listen(port,hostname,()=>{
	console.log(`hello,welcome to nodejs,you are already at http://${hostname}:${port}/`)
});

var chatServer =require("./lib/chat_server");
chatServer.listen(server);