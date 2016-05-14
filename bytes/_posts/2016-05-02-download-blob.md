
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style.display = "none";

                var blob = new Blob([audio], {type: "audio/mpeg"});
                var url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = 'file.mp3';
                a.click();
                window.URL.revokeObjectURL(url);
