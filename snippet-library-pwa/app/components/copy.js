export default function copyCode() {
    var inputText = document.getElementById("codeSnippet").value;

    navigator.clipboard.writeText(inputText).then(function() {
        document.getElementById("copy-to").classList.add("ri-clipboard-fill");
        document.getElementById("copy-to").classList.remove("ri-clipboard-line");
        setTimeout(function(){
            document.getElementById("copy-to").classList.remove("ri-clipboard-fill");
            document.getElementById("copy-to").classList.add("ri-clipboard-line");
       },800);
        console.log("clipboard successfully set");
    }, function() {
        console.log("clipboard write failed");
    });
}

