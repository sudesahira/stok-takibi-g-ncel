
const ProductModule = (() => {
    class Product {
        constructor(name, stock, price, category, image) {
            this.name = name;
            this.stock = stock;
            this.price = price;
            this.category = category;
            this.image = image;
        }
        toJSON = () => ({
            name: this.name,
            stock: this.stock,
            price: this.price,
            category: this.category,
            image: this.image
        });

        applyDiscount = (percentage) => {
            this.price = this.price * (1 - percentage / 100);
        };

        updateStock = (newStock) => {
            this.stock = newStock;
        };

        updatePrice = (newPrice) => {
            this.price = newPrice;
        };
    }

    return { Product };
})();
const { Product } = ProductModule;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const ProductManager = (() => {
    class Manager {
        constructor() {
            this.parcels = [];
        }
        initializeProducts = async () => {
           
            await sleep(200);
            
            this.parcels = [
                new Product("40*60*40 Taşıma Kolisi", 100, 45, "tasima", "https://productimages.hepsiburada.net/s/269/375-375/110000254370851.jpg"),
                new Product("40*60*30 Taşıma Kolisi", 150, 35, "tasima", "https://cdn.myikas.com/images/3d24570a-a0cc-42c3-b7f6-a0b9e1808313/ec2211e3-2ce3-497b-b2c2-80f3ac400a58/1080/tasima-kolisi-cift-oluklu-kraft-60x40x30-cm-10.jpg"),
                new Product("20*1 LT Taşıma Kolisi", 80, 55, "sivi", "https://www.azizogluambalaj.com/images/e-ticaret_kutu.jpg"),
                new Product("2*10 LT Taşıma Kolisi", 60, 40, "sivi", "https://www.azizogluambalaj.com/images/standart_koli.jpg"),
                new Product("4*5 LT Taşıma Kolisi", 90, 50, "sivi", "https://www.azizogluambalaj.com/images/ozel_olcu_kutu.jpg")
            ];
        };
        getProductsByCategory = (category) => {
            return category === 'hepsi' ? this.parcels : this.parcels.filter(p => p.category === category);
        };
        addProduct = async (name, stock, price, category, image) => {
           
            await sleep(100);
            this.parcels.push(new Product(name, stock, price, category, image));
        };
        deleteLastProduct = async () => {
           
            await sleep(100);
            if (this.parcels.length > 0) {
                this.parcels.pop();
            }
        };
        applyDiscountToAll = async (discountPercent) => {
          
            await sleep(200);
            this.parcels.forEach(product => product.applyDiscount(discountPercent));
        };

        updateProductByName = async (name, newStock, newPrice) => {
          
            await sleep(150);
            const product = this.parcels.find(p => p.name === name);
            if (product) {
                product.updateStock(parseInt(newStock));
                product.updatePrice(parseFloat(newPrice));
                return true;
            }
            return false;
        };
    }
    return new Manager();
})();

const tasimaCategorisi = ProductManager.getProductsByCategory('tasima');  
const siviCategorisi = ProductManager.getProductsByCategory('sivi');     
console.log("📦 Taşıma Kolileri:", tasimaCategorisi);
console.log("💧 Sıvı Taşıma Kolileri:", siviCategorisi);
(async () => {
    await ProductManager.initializeProducts();
    console.log("✅ Tüm veriler yüklendi!");
})();
const categoryList = async (vote) => {
    const area = document.getElementById("display-area");
    const title = document.getElementById("main-title");
    area.innerHTML = "<p style='color: gray;'>Yükleniyor...</p>";
    title.style.color = "blue";
    
   
    await sleep(300);
    
    area.innerHTML = "";
    const filteredProducts = ProductManager.getProductsByCategory(vote);
    
    filteredProducts.forEach(product => {
        const { name, image, stock, price } = product; 
        const urunDiv = document.createElement("div");
        urunDiv.innerHTML = `
            <h4>${name}</h4>
            <img src='${image}' width='150' alt='Koli'>
            <p>Stok: <b>${stock}</b> | Fiyat: <b>${price.toFixed(2)} TL</b></p>
            <hr>
        `;
        area.appendChild(urunDiv);
    });
};
const addProduct = async () => {
    const area = document.getElementById("display-area");
    area.innerHTML = "<p style='color: gray;'>İşlem yapılıyor...</p>";
    await ProductManager.addProduct("Özel Koli", 10, 100, "tasima", "https://www.azizogluambalaj.com/images/ozel_olcu_kutu.jpg");
    await categoryList('hepsi');
};
const deleteLastProduct = async () => {
    const area = document.getElementById("display-area");
    area.innerHTML = "<p style='color: gray;'>İşlem yapılıyor...</p>";
    await ProductManager.deleteLastProduct();
    await categoryList('hepsi');
};
const discountApply = async () => {
    const area = document.getElementById("display-area");
    area.innerHTML = "<p style='color: gray;'>İşlem yapılıyor...</p>";
    await ProductManager.applyDiscountToAll(10);
    await categoryList('hepsi');
};

const updateData = async (event) => {
    event.preventDefault();
    const area = document.getElementById("display-area");
    area.innerHTML = "<p style='color: gray;'>Güncelleniyor...</p>";
    
    const currentNameEl = document.getElementById("current-name");
    const updatedStockEl = document.getElementById("updated-stock");
    const updatedPriceEl = document.getElementById("updated-price");
    
    const { value: productName } = currentNameEl;
    const { value: newStock } = updatedStockEl;
    const { value: newPrice } = updatedPriceEl;
    try {
        const success = await ProductManager.updateProductByName(productName, newStock, newPrice);
        if (success) {
            alert(productName + " güncellendi!");
            await categoryList('hepsi');

            [currentNameEl, updatedStockEl, updatedPriceEl].forEach(el => el.value = "");
        } else {
            alert("Ürün bulunamadı!");
        }
    } catch (error) {
        console.error("Update error:", error);
        alert("Hata oluştu!");
    }
};