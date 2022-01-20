/*
    - Read in file
    - remove newlines
    - 
    - replace punctuation with a space before (.,!?- tab " “ ”)
    - transform into an array (split strings on space?)
    - run through array and get 2 next words, then add to dictionary.
        - Then get next word and add that, with a count

    - Target data structure looks like this:
        {
            "no" : {"person": 2, "where": 4, "good": 1, "dice": 1}, 
            "at" : {"once": 4, "all": 5, "the": "8"}, 
            "bob" : {"dylan" : 3, "marley": 5, "the": 3, "haircut": 2}
        }
    - For more context, expand the first word into n words 
        {
            "once upon a" : {"time": 10, "star": 2, "hill": 1, "twice": 1}, 
            "the fact that" : {"you": 4, "I": 5, "they": "8", "he": 2, "she": 2, "it": 3, "people":4}
        }
*/

const fs = require('fs'); 
const depth = 3

let all_words = readFilesIntoWordArray(["hgwells.txt", "franklin.txt", "dickens.txt"]); 
let map = buildMap(all_words, depth); 
console.log(map); 

var output = create_sentence("and then i", map, 200, depth); 

console.log(output); 


function suggest_word(start_phrase, word_map){
    let word_list = word_map[start_phrase];
    let suggested_word = choose_word_weighted(word_list);
    return suggested_word; 
}


// Creates a new sequence of words, of max length, given a starting phrase
function create_sentence(start_phrase, word_map, sentence_length=10, depth = 2){
    let sentence = ""; 
    for (let word_count = 0; word_count < sentence_length; word_count++) {
            let next_word = choose_word_weighted(word_map[start_phrase]);
            sentence = sentence + next_word + ' '; 
            tokenized_phrase = start_phrase.split(' '); 
            start_phrase = ""
            for (let i = 1; i < depth; i++) {
                start_phrase = start_phrase + tokenized_phrase[i] + ' ';              
            }
            start_phrase = start_phrase + next_word; 
    }
    return sentence; 
}

function choose_word(word_list){
    var keys = Object.keys(word_list);
    var word = keys[ keys.length * Math.random() << 0];
    return word; 
}

function choose_word_weighted(word_list){

    // Get a array of all the words in the word list object, 
    // so we can run through each and get their weights 
    var keys = Object.keys(word_list);

    // Get the sum of all the weights
    let sum_of_weights = 0; 
    keys.forEach(key => {
        sum_of_weights += word_list[key]; 
    });

    // Math.random() returns a number from 0 to 1, 
    // so we scale it up the sum of the weights
    let random = Math.random() * sum_of_weights; 


    // Go through every word,  and subtract its weight from 
    // our random number. When we reach 0 or below, 
    // that is the word we choose
    let curr_word = ''; 
    keys.every(word => {
        curr_word = word; 
        random -= word_list[word]; 
        return (random > 0); 
    });

    return curr_word; 
} 

/*
   Runs through the list, gets the next n-1 words, and maps it to the n+1 word
*/
function buildMap(tokens, depth){
    let map = {};

    // for each entry in the tokens
    for (let index = 0; index < tokens.length - depth; index++) {
       
        //create a phrase from the current token and the next depth-1 number of tokens
        let phrase = ""; 
        for (let depthIndex = 0; depthIndex < depth; depthIndex++) {
            const curr_word = tokens[depthIndex + index];
            phrase = phrase + ' ' + curr_word; 
        }
        // Get rid of any extra space we added in when constructing the phrase from tokens
        phrase = phrase.trimStart(); 

        //if the phrase doesn't already exist in the map
        //    add the phrase to the map, and add a blank 
        if (!map[phrase]){
            map[phrase] = {}; 
        }

        // Gets the next word after the phrase
        let next_word = tokens[index + depth];
        
        // See if the next word exists in the phrase word list
        // If it doesn't already exist in the possible next word list, add it in, and set weight to 1
        // if it does exist, just increment the weight
        let next_word_list = map[phrase]; 
        if (!next_word_list[next_word]){
            next_word_list[next_word] = 1
        } else
        {
            next_word_list[next_word] ++; 
        }
    }
    
    return map; 
}

function readFilesIntoWordArray(filenames){

    let data =""; 
    filenames.forEach(file => {
        data = data + ' ' +  fs.readFileSync(file, 'utf8'); 
    });

    // remove newlines
    data = data.replace(/\r?\n|\r/g, " "); 
    
    // Put spaces around each special character / punctuation, 
    // so that when we split on spaces, they come out as their own tokens, 
    // disconected from surrounding words  
    const replacements = [',','.',':','!','?','"','“','”',';','(',')','-','_']; 
    replacements.forEach((value)=>{
        data = data.replace(RegExp('\\' + value,'g'), ' ' + value + ' '); 
    }); 

    data = data.toLowerCase(); 
    // Split on spaces to get each word by itself, indexed. 
    var word_array = data.split(' '); 

    // remove all pure whitespace entries
    word_array = word_array.filter(word=> word.trim().length != 0); 
    return word_array; 
}