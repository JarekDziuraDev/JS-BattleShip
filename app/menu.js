const start_new_game_btn = document.querySelector('#name_text_box_ok')


start_new_game_btn.addEventListener('click', function() {
    let text_input1 = document.getElementById('name_text_box1').value
    let text_input2 = document.getElementById('name_text_box2').value

    localStorage.setItem('cached_names_player_one', text_input1)
    localStorage.setItem('cached_names_player_two', text_input2)
})


