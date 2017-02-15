function stripHTML(str){
	// remove all string within tags
	var tmp = str.replace(/(<.*['"])([^'"]*)(['"]>)/g,
		function(x, p1, p2, p3) {
			return  p1 + p3;
		}
	);
	// now remove the tags
	return tmp.replace(/<\/?[^>]+>/gi, '');
}

function parseTXT(docID, docLink, text) {
	var StrReplace = {
			"_":" ",
			" - ":" ",
			" – ":" ",
			"=":" ",
			"î":"",
			"ì":"",
//			"[(,),{,},<,>,»,«,’,',‘,”,“,„,‚,\",&,#,*,§,€,$,+,:,;]": "",
			"[(,),{,},<,>,»,«,’,',‘,”,“,„,‚,\",&,#,*,+,:,;]": "",
			"  " : " "
	};
	var StructReplace = {
		"|":"",
		"\t":" ",
		"\r\n":"\n",
		"\n\n":"||",
		"\n":" "
	};
	var word_count = 0;
	var obj_chars = 0;
	var doc = { "id" : docID, "link" : docLink, quants: 0, chars: 0, "context" : [] };
	context = text.toString();
	context = context.toLowerCase()
		.replace(/\?/g,"|")
		.replace(/\. /g,"|")
		.replace(/\!/g,"|");
/*

		.replace(/\[/g," ")
		.replace(/\]/g," ")
		.replace(/\;/g, ". ")
		.replace(/:/g, ". ")
		.replace(/,/g," ")
		.replace(/\./g, ". ");
*/

// createStucture
	for (val in StructReplace) {
		context = context.replace(new RegExp(val, "g"), StructReplace[val]);
	}
// getParagraph
	var paragraph = context.split('||');
	for(p in paragraph) {
		if (paragraph[p].length != 0) {
			para = { paragraph :[] };
			for (var val in StrReplace) {
				paragraph[p] = paragraph[p].replace(new RegExp(val, "g"), StrReplace[val]);
			}
// getSentence
			sentence = paragraph[p].split("|");
			for (s in sentence) {
				if (sentence[s].length != 0) {
					sent = { sentence : [] };
// getQuants
					words = sentence[s].split(" ");
					var quants;
					for (w in words) {
						words[w] = words[w].replace(/\s/g, "").replace(/\|/g, "");
						var endWord = words[w].substr(words[w].length-1, words[w].length);
						if (endWord == ".") {
							words[w] = words[w].replace(/\./g, "");
						}
						if (words[w].length != 0) {
							sent.sentence.push(words[w]);
							word_count ++;
							obj_chars = obj_chars + words[w].length;
						}
					}
					if (sent.sentence.length != 0) {
						para.paragraph.push(sent);
//						doc.context.push(sent);
					}
				}
			}
			if (para.paragraph.length != 0) {
				doc.context.push(para);
			}
		}
	}
	//doc.id = docID.toLowerCase().replace(/ /g, "-");
	doc.quants = word_count;
	doc.chars = obj_chars;
	return JSON.stringify(doc);
//	console.log(JSON.stringify(doc));
}
