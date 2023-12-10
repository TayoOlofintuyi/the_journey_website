document.addEventListener('DOMContentLoaded', function() {
    const file = document.getElementsByClassName('RemAEvents');
    if (file) {
        file.addEventListener('save', function(event) {
            event.preventDefault();
            alert("Event has been saved!");

            const title = document.getElementById('name').value;
            const date = document.getElementById('dateTime').value;
            const description = document.getElementById('descInfo').value;

            if (typeof(Storage) !== "undefined") {
                let reminders = JSON.parse(localStorage.getItem('Reminders')) || [];

                reminders.push({title, date, description});

                localStorage.setItem('Reminders', JSON.stringify(reminders));
                console.log("What's in here?", reminders);
            }
            else {
                alert('Local storage is not supported in your browser.');
            }
        });
    }
});