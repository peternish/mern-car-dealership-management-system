
export default function SearchByVIN() {

    // Handle Search
    const handleSearch = (e) => {
        var input, table, tr, td, i, txt;
        input = e.target.value.toUpperCase();
        table = document.getElementById('myTb');
        tr = table.getElementsByTagName('tr');
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName('td')[0];
            if (td) {
            txt = td.textContent || td.innerText;
            if (txt.toUpperCase().indexOf(input) > -1) {
                tr[i].style.display = '';
            } else {
                tr[i].style.display = 'none';
            }
            }
        }
        };

    return (
        <div className="flex justify-center items-center px-2 border-2 rounded-md ">
            <img
            alt="search-icon"
            className="w-5 h-5"
            src={require("../assets/search-icon.png")}
            />
            <input
            className="border-none outline-none focus:border-none text-xs"
            type="text"
            id="searchInput"
            placeholder="Search here by VIN"
            onChange={handleSearch}
            />
        </div>
    )
}