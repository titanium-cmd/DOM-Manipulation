const createListItem = (name) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = ""
    li.appendChild(a);
    li.textContent = name;
    return li;
}

const loader = ({ state = 'show' }) => { 
    const p = document.querySelector('#loader');
    p.textContent = 'Loading...';
    p.style.display = state === 'hide' ? 'none' : 'block';
}

const getUsers = async () => {
    try {
        loader({ state: 'show' });
        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        const users = await res.json();
        return users;
    } catch (error) {
        console.log('error::', error);
        alert("Error fetching users. Kindly check your internet connection and try again.");
    } finally {
        loader({ state: 'hide' });
    }
}

(async () => {
    const users = await getUsers();
    if (users) {
        const usersTable = window.document.querySelector('table');
        // usersTable.createTHead
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const row = usersTable.insertRow(i);   
            row.insertCell(0).appendChild(document.createTextNode(user.id))
            row.insertCell(1).appendChild(document.createTextNode(user.name))
            row.insertCell(2).appendChild(document.createTextNode(user.email))
        }
    }
    console.log('users::: ', users);
})()