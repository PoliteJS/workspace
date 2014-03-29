/**
 * https://gist.github.com/k33g/1307428
 */

var fs = require('fs');

function mkmanifest(params){
	
	var aFileList = [];
	var traverseFileSystem = function (currentPath) {
		var files = fs.readdirSync(currentPath);
		
		files.forEach(function(item){
			//exclude .git files
			//if(currentPath.indexOf(".git")==-1 && item.indexOf(".git")==-1) {
				var currentFile = currentPath + '/' + item;
				var stats = fs.statSync(currentFile);
				if (stats.isFile()) {
					aFileList.push(currentFile.split(params.path)[1]);
				} else if (stats.isDirectory()) {
					traverseFileSystem(currentFile);
				}
			//}			
		});
	};
	
	traverseFileSystem(params.path);
	var contents = "CACHE MANIFEST\n";
	contents += "# version " + params.version + "\n\n";
	//Cache section
	contents += "CACHE:\n";	
    
    
    // needs to be enriched with regular expression exclusions!
	if(params.exclude) {
		aFileList = aFileList.filter(function(filePath) {
            var include = true;
            params.exclude.forEach(function(rule) {
                if (rule.substr(rule.length-2, 2) === '**') {
                    rule = rule.substr(0, rule.length-2);
                    if (filePath.indexOf(rule) !== -1) {
                        include = false;
                    }
                } else {
                    if (filePath === rule) {
                        include = false;
                    }
                }
            });
            return include;
        });
	} 
	aFileList.forEach(function(item){ contents += item + "\n"; });

	//Network section
	if(params.network) {
		contents += "\nNETWORK:\n"
		params.network.forEach(function(item){ contents += item + "\n"; });
	}
	
	//Fallback section
	if(params.fallback) {
		contents += "\nFALLBACK:\n"
		params.fallback.forEach(function(item){ contents += item + "\n"; });
	}
    
    // write sync for grunt compatibility
	fs.writeFileSync(params.path + '/' + params.filename + '.manifest', contents, 'utf8');
    if (params.generateHtaccess === true) {
        fs.writeFileSync(params.path + '/' + ".htaccess", "AddType text/cache-manifest .manifest", 'utf8');
    }
	
	console.log("Cache manifest file generated : " + params.filename + ".manifest\n");
	console.log(contents);
	
}

module.exports = mkmanifest;