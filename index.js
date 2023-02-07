const express = require("express");
const request = require("request");
const cheerio = require('cheerio');
const fs = require('fs')


const string = 'https://www1.gogoanime.bid/'

const app = express();
app.use(express.json());
app.use('/hello', express.static('public'))


app.get('/popular/:page',(req,res) =>{

    let txt = [],img = [],movie =[]
    let result = []
    const url = `${string}popular.html?page=${req.params.page}`

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
                query.query = $('.items') 
                query.find('.name').each(function (i, elem) {
                    movie.push($(this).find('a').prop('href').split("/").pop())
                })
                result  = txt.map((elem1, index) =>{
                    return { img:img[index], text: elem1 , id:movie[index] };
                })
                
                res.status(200).json({result})
            }catch(e){
                res.status(404).json({e: "404"})
            }
        }

        
    })
})

app.get('/movie/:id',(req,res) =>{
    let Movie = []
    
    const url = `${string}category/${req.params.id}`

    request(url,(error,response,html) =>{
        if(!error){
            try{
                var $ = cheerio.load(html);
                const des =  $('.anime_info_body_bg').find($('p').get(2)).text()
                const genre =  $('.anime_info_body_bg').find($('p').get(3)).text().replace(/\s/g, "")
                const ep = $('#episode_page').find('li').text().replace(/\s/g, " ")
                Movie = {des,genre,ep}
                res.status(200).json({Movie})
                console.log(Movie)
            }catch(e){
                throw(e)
            }
        }
    })

})

app.get('/video/:id/:ep',(req,res)=>{

    const url = `${string}${req.params.id}-episode-${req.params.ep}`
                // https://www1.gogoanime.bid/id=dungeon-ni-deai-wo-motomeru-no-wa-machigatteiru-darou-ka-iv-fuka-shou-yakusai-hen/ep=2
    console.log(url)
    request(url,(error,response,html)=>{
        if(!error){
            try{
                var $ = cheerio.load(html);
                var iframe = $.html($('iframe'))
                res.status(200).json({iframe}) 
                console.log(url)
            }catch(e){
                res.status(404).json(iframe)
                throw(e)
            }
        }
    })
        
})

app.get('/search/:id',(req,res)=>{

    let txt = [],img = [],movie = []

    const url = `https://www1.gogoanime.bid/search.html?keyword=${req.params.id}`
    request(url,(error,response,html) =>{
        if(!error){
            try{
                var $ = cheerio.load(html);
                const query = $('.items') 
                query.find('.name').each(function (i, elem) {
                    txt.push($(this).text().replace(/[\n\t]/g, ""))
                });
                query.find('img').each(function (i, elem){
                    img.push($(this).prop('src'))
                })
                query.query = $('.items') 
                query.find('.name').each(function (i, elem) {
                    movie.push($(this).find('a').prop('href').split("/").pop())
                })
                result  = txt.map((elem1, index) =>{
                    return { img:img[index], text: elem1 , id:movie[index] };
                })
                
                res.status(200).json({result})
            }catch(e){
                res.status(404).json({e: "404"})
            }
        }

        
    })

})

app.get('/genre/:cate/:num',(req,res)=>{

    let txt = [],img = [],movie = []
    const url = `https://www1.gogoanime.bid/genre/${req.params.cate}?page=${req.params.num}`
    request(url,(error,response,html) =>{
        if(!error){
            try{
                var $ = cheerio.load(html);
                const query = $('.items') 
                query.find('.name').each(function (i, elem) {
                    txt.push($(this).text().replace(/[\n\t]/g, ""))
                });
                query.find('img').each(function (i, elem){
                    img.push($(this).prop('src'))
                })
                query.query = $('.items') 
                query.find('.name').each(function (i, elem) {
                    movie.push($(this).find('a').prop('href').split("/").pop())
                })
                result  = txt.map((elem1, index) =>{
                    return { img:img[index], text: elem1 , id:movie[index] };
                })
                
                res.status(200).json({result})
            }catch(e){
                res.status(404).json({e: "404"})
            }
        }

        
    })
})

// const cate = async() =>{

//     let txt = [],img = [],movie =[]
//     let fruits = [];

//     const url = 'https://www1.gogoanime.bid/search.html?keyword=ben 10'
//     request(url,(error,res,html)=>{
//         try{
//             var $ = cheerio.load(html);
//             const query = $('.items')
//             query.find('.name').each(function (i, elem) {
//                 txt.push($(this).text().replace(/[\n\t]/g, ""))
//             });
//             query.find('img').each(function (i, elem) {
//                 img.push($(this).prop('src'))
//             });
//             query.find('.name').each(function (i, elem) {
//                 movie.push($(this).find('a').prop('href').split("/").pop())
//             })
//             result  = txt.map((elem1, index) =>{
//                 return { img:img[index], text: elem1 , id:movie[index] };
//             })
//             console.log(result)
//         }catch(e){
//             throw(e)
//         }
//     })

// }


const start = async () => {

    try{
        app.listen(3000, () => {
            console.log(`Server is running... 3000`);
        });
    }catch(e){
        throw(e)
    }
}

start()