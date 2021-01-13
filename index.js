#!/usr/bin/env node

// `npx create-sparkling-app <template> <dirname>`
const fs = require('fs-extra');
const argv = process.argv;

function execCopy(type, tplname, topath) {
    try {
        fs.copySync(process.cwd() + `/${type}/${tplname}`, topath, {
            errorOnExist: true
        });
    } catch(e) {
        console.log("Your target folder already exists, please check!");
        process.exit(1);
    }
}

function modifyPkgJson(topath) {
    try {
        const pkgJson = fs.readJSONSync(topath + '/package.json');
        fs.writeJsonSync(topath + '/package.json', Object.assign(pkgJson, {name: topath.split("/").reverse()[0]}), {spaces: 2})
    } catch(e) {
        console.log("Modify `package.json` failed! Message: " + e.message);
        process.exit(1);
    }
}

function main() {
    console.log(__dirname);
    const tplname = argv[2];
    const type = "scaffold";
    if(!tplname) {
        console.log("[Error] Empty scaffold name, exit!");
        process.exit(1);
    }
    if(!fs.existsSync(process.cwd() + `/${type}/${tplname}`)) {
        console.log("[Error] No exist scaffold named '"+ tplname +"', please check!");
        process.exit(1);
    }
    const topath = argv[3];
    if(!topath) {
        console.log("[Warning] Empty folder name, use scaffold name instead.");
        topath = tplname;
    }
    execCopy(type, tplname, topath);
    modifyPkgJson(topath);
}

main();