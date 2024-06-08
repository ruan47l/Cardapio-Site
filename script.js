const menu = document.getElementById('menu')
const CartBTN = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCounter = document.getElementById('cart-count')
const addressInput = document.getElementById('address')
const addressWarn = document.getElementById('address-warn')



let cart = []

// abrir o modal
CartBTN.addEventListener('click', function(){
    cartModal.style.display = "flex"
    updateCartModal()
})

// fechear o modal
closeModalBtn.addEventListener("click",function(){
    cartModal.style.display = "none"
})


menu.addEventListener('click',function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))
        addToCart(name,price)
    }
})

function addToCart(name,price){
    const existingitem = cart.find(item => item.name === name)

    if(existingitem){
        existingitem.quantity += 1
    }else{
        cart.push({
            name,
            price,
            quantity:1,
        })
    }
    updateCartModal()
}

    
// atualiza o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0

    cart.forEach(item => {
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("flex","justify-between","mb-4","flex-col")

        cartItemElement.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>QTD: ${item.quantity}</p>
                    <p class="font-medium">${item.price.toFixed(2)}</p>
                </div>

                <button class="remove-from-cart-btn" data-name="${item.name}" >
                    remover
                </button>
            </div>`
        
        total += item.price * item.quantity    
        cartItemsContainer.appendChild(cartItemElement)
    });
    cartTotal.textContent = total.toLocaleString("pt-br",{
        style:"currency",
        currency:"BRL"
    })
    cartCounter.innerHTML = cart.length
}

cartItemsContainer.addEventListener("click",function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute('data-name')

        removeItemCart(name)
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name)

    if(index !== -1){
        const item = cart[index]

        if( item.quantity > 1){
            item.quantity -= 1
            updateCartModal()
            return
        }
        cart.splice(index,1)
        updateCartModal()
    }
}

addressInput.addEventListener("input",function(event){
    let inputValue = event.target.value

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

checkoutBtn.addEventListener("click",function(){

    const isOpen = checkRestaurantOpen()
    if( ! isOpen){
        alert("O restaurante esta fechando no memento, aberto das 18 ás 22")
        return
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return
    }
   
    const cartItems = cart.map((item) => {
        return (`${item.name}, Quantidade: ${item.quantity}, preço: ${item.price}`)
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = 61958476325

    window.open(`https://wa.me/${phone}?text=${message}, Endereço: ${addressInput.value}`, "_blank")

    cart = []
    updateCartModal()
})


function checkRestaurantOpen(){
    const data = new Date()
    const hora =  data.getHours()
    return hora >= 18 && hora  < 22
}
const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen()

if(isOpen){
    spanItem.classList.remove("bg-red-600")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-600")
}