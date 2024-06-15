document.addEventListener('DOMContentLoaded', () => {
    const bookNameInput = document.getElementById('bookName');
    const authorInput = document.getElementById('author');
    const addBookButton = document.getElementById('addBook');
    const searchInput = document.getElementById('search');
    const bookList = document.getElementById('bookList');
    const saveXMLButton = document.getElementById('saveXML');
    const loadXMLButton = document.getElementById('loadXML');
    const bookCount = document.getElementById('bookCount');
    const partsInput = document.getElementById('parts');
    const sectionInput = document.getElementById('section');
        

    const STORAGE_KEY = 'Mylibrary';

    const loadBooks = () => {
        const books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        books.forEach(addBookToList);
        updateBookCount();
    };

    const saveBooks = (books) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    };

    const addBookToList = (book) => {
        const card = document.createElement('div');
        card.classList.add('book-card');

        const nameElement = document.createElement('h3');
        nameElement.textContent = book.name;
        card.appendChild(nameElement);

        const authorElement = document.createElement('p');
        authorElement.textContent = `المؤلف: ${book.author}`;
        card.appendChild(authorElement);

        const partsElement = document.createElement('p');
        partsElement.textContent = `عدد الاجزاء: ${book.parts}`;
        card.appendChild(partsElement);
        
        const sectionElement = document.createElement('p');
        sectionElement.textContent = `القسم: ${book.section}`;
        card.appendChild(sectionElement);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '🗑';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', () => deleteBook(card, book));
        card.appendChild(deleteButton);

        const editButton = document.createElement('button');
        editButton.textContent = '✏️';
        editButton.classList.add('edit');
        editButton.addEventListener('click', () => editBook(book));
        card.appendChild(editButton);

        bookList.appendChild(card);
    };

    const addBook = () => {
        const bookName = bookNameInput.value.trim();
        const authorName = authorInput.value.trim();
        const partsName = partsInput.value.trim();
        const sectionName = sectionInput.value.trim();

        if (bookName && authorName && partsName && sectionName) {
            const books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            const existingBook = books.some(book => book.name === bookName && book.author === authorName);

            if (!existingBook) {
                const book = { name: bookName, author: authorName, parts: partsName, section: sectionName };
                books.push(book);
                saveBooks(books);

                addBookToList(book);
                updateBookCount();

                bookNameInput.value = '';
                authorInput.value = '';
                partsInput.value = ''; // تفريغ حقل العدد بعد الإضافة
                sectionInput.blur(); // إخفاء لوحة المفاتيح بعد الإضافة
                sectionInput.value = '';
            } else {
                alert('الكتاب موجود بالفعل في المكتبة');
            }
        } else {
            alert('يرجى ملء جميع الحقول');
        }
    };

    const deleteBook = (card, book) => {
        const confirmation = confirm('هل أنت متأكد من رغبتك في حذف هذا الكتاب؟');

        if (confirmation) {
            bookList.removeChild(card);

            const books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            const index = books.findIndex(b => b.name === book.name && b.author === book.author);
            if (index !== -1) {
                books.splice(index, 1);
            }
            saveBooks(books);

            updateBookCount();
        } else {
            console.log('تم إلغاء الحذف.');
        }
    };

    const editBook = (book) => {
        const newName = prompt('الاسم الجديد للكتاب:', book.name);
        if (newName === null) {
            return; // تم الضغط على إلغاء
        }

        const newAuthor = prompt('المؤلف الجديد للكتاب:', book.author);
        if (newAuthor === null) {
            return; // تم الضغط على إلغاء
        }

        const newParts = prompt('القسم الجديد للكتاب:', book.parts);
        if (newParts === null) {
            return; // تم الضغط على إلغاء
        }
        
        const newSection = prompt('القسم الجديد للكتاب:', book.section);
        if (newSection === null) {
            return; // تم الضغط على إلغاء
        }

        book.name = newName.trim();
        book.author = newAuthor.trim();
        book.parts = newParts.trim();
        book.section = newSection.trim();

        const books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        const index = books.findIndex(b => b.name === book.name && b.author === book.author);
        if (index !== -1) {
            books[index] = book;
            saveBooks(books);
            reloadBooks();
        }
    };

    const reloadBooks = () => {
        bookList.innerHTML = '';
        const books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        books.forEach(addBookToList);
        updateBookCount();
    };

   
    const updateBookCount = () => {
        const books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        bookCount.textContent = `عدد الكتب في المكتبة: ${books.length}`;
    };
    
    //key
    const searchBooks = () => {
    const query = searchInput.value.trim().toLowerCase();

    Array.from(bookList.children).forEach(card => {
        const bookName = card.querySelector('h3').textContent.toLowerCase();
        const authorName = card.querySelector('p').textContent.toLowerCase();
        const isVisible = bookName.includes(query) || authorName.includes(query);
        card.style.display = isVisible ? 'block' : 'none';
    });
};

searchInput.addEventListener('input', searchBooks);
    
    //and key

    const handleEnterKeyPress = (event) => {
        if (event.key === 'Enter') {
            addBook();
            event.preventDefault(); // لمنع السلوك الافتراضي للنموذج عند الضغط على Enter
        }
    };

    sectionInput.addEventListener('keypress', handleEnterKeyPress);

    addBookButton.addEventListener('click', addBook);

    saveXMLButton.addEventListener('click', () => {
        const books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        const xmlContent = `
            <books>
                ${books.map(book => `
                    <book>
                        <name>${book.name}</name>
                        <author>${book.author}</author>
                        <section>${book.section}</section>
                    </book>`).join('')}
            </books>
        `;
        const blob = new Blob([xmlContent], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'books.xml';
        a.click();
        URL.revokeObjectURL(url);
    });

    loadXMLButton.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xml';

        input.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(e.target.result, 'application/xml');
                const books = Array.from(xmlDoc.getElementsByTagName('book')).map(book => ({
                    name: book.getElementsByTagName('name')[0].textContent,
                    author: book.getElementsByTagName('author')[0].textContent,
                    section: book.getElementsByTagName('section')[0].textContent,
                }));

                localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
                reloadBooks();
            };

            reader.readAsText(file);
        };

        input.click();
    });

    const resetLocalStorage = () => {
        localStorage.removeItem(STORAGE_KEY);
        bookList.innerHTML = '';
        updateBookCount();
        alert('تم حذف التخزين المحلي بنجاح.');
    };

    document.getElementById('resetLocalStorage').addEventListener('click', resetLocalStorage);
    loadBooks();
});