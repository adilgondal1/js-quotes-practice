const ul = document.querySelector("#quote-list")
const form = document.getElementById("new-quote-form")

/* ------------------------------------------------------- */
//extra learning
const sortBtn = document.createElement("button")
sortBtn.className = "btn-primary"
document.body.children[1].prepend(sortBtn)
/* ------------------------------------------------------- */

function fetchQuotes(){
    ul.innerHTML = ""

    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(res => res.json())
    .then(quotes => {
        quotes.forEach(quote => {
            quoteCard(quote)
            /* ------------------------------------------------------- */
            // extra learning
            sortBtn.innerText = "Sort by Author Name"
            sortBtn.dataset.sort = "authors"
            /* ------------------------------------------------------- */
        })
    })
}

function quoteCard(quote){
    const li = document.createElement("li")
    li.className =  "quote-card"

    const bq = document.createElement("blockquote")
    bq.className = "blockquote"

    const p = document.createElement("p")
    p.className = "mb-0"
    p.innerText = quote.quote

    const footer = document.createElement("footer")
    footer.className = "blockquote-footer"
    footer.innerText = quote.author

    const br = document.createElement('br')

    const likebtn = document.createElement("button")
    likebtn.className = "btn-success"
    likebtn.innerText = "Likes: "

    const span = document.createElement("span")
    if(quote.likes){
        span.innerText = quote.likes.length
    }else{
        span.innerText = 0
    }
    

    likebtn.append(span)

    /* ------------------------------------------------------- */
    // Advanced Deliverable
    likebtn.addEventListener("click", ()=> { 
            fetch("http://localhost:3000/likes",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "quoteId": quote.id,
                    "createdAt": Date.now() //extra learning
                })
            })
            .then(() => {
                let likes = parseInt(span.innerText)
                span.innerText = ++likes
            })
    })
    /* ------------------------------------------------------- */

    const deletebtn = document.createElement("button")
    deletebtn.className = "btn-danger"
    deletebtn.innerText = "Delete"

    deletebtn.addEventListener("click", () => {
        fetch(`http://localhost:3000/quotes/${quote.id}`,{
            method: "DELETE"
        })
        .then(() => li.remove())
    })

    bq.append(p, footer, br, likebtn, deletebtn)

    li.append(bq)

    ul.append(li)
}


form.addEventListener("submit", (e) => {
    e.preventDefault()
    fetch("http://localhost:3000/quotes",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "quote": e.target[0].value,
            "author": e.target[1].value
        })
    })
    .then(res => res.json())
    .then(newQuote => {
        quoteCard(newQuote)
        form.reset()
    })

})

fetchQuotes()


/* ------------------------------------------------------- */
// extra learning

sortBtn.addEventListener("click", () => {

    if(sortBtn.dataset.sort === "authors"){
        sortByAuthor()
    }else{
        fetchQuotes()
    }
})

function sortByAuthor(){
    ul.innerHTML = ""

    fetch("http://localhost:3000/quotes?_embed=likes&&_sort=author")
    .then(res => res.json())
    .then(quotes => {
        quotes.forEach(quote => quoteCard(quote))
        sortBtn.innerText = "Sort by QuoteIDs"
        sortBtn.dataset.sort = "ids"
    })
}

/* ------------------------------------------------------- */