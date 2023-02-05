const express = require("express");
const request = require("request");
const cheerio = require('cheerio');
const fs = require('fs')


const baseURL = "https://gogoanime.ai/";

const string = 'https://www1.gogoanime.bid/'
const cat = 'https://www1.gogoanime.bid/category/'


const app = express();
app.use(express.json());
app.use('/hello', express.static('public'))


app.get('/popular/:page',(req,res) =>{

    let txt = [],img = []
    let result = []
    let page = req.params;
    const url = `${string}popular.html?page=${page}`

    // if(isNaN(page)) return res.status(404).json({result})

    request(url,(error,response,html) =>{
        if(!error){
            try{
                var $ = cheerio.load(html);
                const query = $('.items') 
                query.find('.name').each(function (i, elem) {
                    txt.push($(this).text())
                });
                query.find('img').each(function (i, elem){
                    img.push($(this).prop('src'))
                })
                result  = txt.map((elem1, index) =>{
                    return { img:img[index], text: elem1 };
                })
                console.log(result)
                res.status(200).json({result})
            }catch(e){
                res.status(404).json({e: "404"})
            }
        }

        
    })
})

const cate = async() =>{

    let txt = [],img = []
    let fruits = [];

    const url = 'https://www1.gogoanime.bid/category/nierautomata-ver1-1a'
    request(url,(error,res,html)=>{
        try{
            var $ = cheerio.load('<div><p>hello</p><p>make</p></div>');
            const p =  $('p').get(0)
             console.log(p.text())
        }catch(e){
            throw(e)
        }
    })

}


// const ch = async() =>{
//     let txt = [],img = []
//     let fruits = [];
//     request(url,(error,res,html)=>{
//         try{
//             var $ = cheerio.load(html);
//             const query = $('.items')
//             query.find('.name').each(function (i, elem) {
//                  txt.push($(this).text())
//             });
//            query.find('img').each(function (i, elem){
//             img.push($(this).prop('src'))
//            })
//             fruits  = txt.map((elem1, index) =>{
//                 return { img:img[index],
//                     text: elem1 };
//             })
//             //  fs.writeFileSync('./html.json',`${fruits}`)
//             console.log(fruits)
//         }catch(e){
//             throw(e)
//         }
//     })
    
    

// }

const start = async () => {

    try{
        app.listen(3000, () => {
            console.log(`Server is running... 3000`);
            cate()   
        });
    }catch(e){
        throw(e)
    }
}

start()