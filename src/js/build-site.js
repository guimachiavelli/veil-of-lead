/* jshint node: true */

'use strict';

let fs = require('fs'),
    marked = require('marked'),
    mustache = require('mustache');

const TPL = {
    index: fs.readFileSync('./templates/index.html', {encoding: 'utf-8'}),
    about: fs.readFileSync('./templates/about.html', {encoding: 'utf-8'}),
    story: fs.readFileSync('./templates/story.html', {encoding: 'utf-8'}),
    volume: fs.readFileSync('./templates/volume.html', {encoding: 'utf-8'}),
    header: fs.readFileSync('./templates/header.html', {encoding: 'utf-8'}),
    footer: fs.readFileSync('./templates/footer.html', {encoding: 'utf-8'})
};

function pageHTML(data, header, footer) {
    data.html = mustache.render(header + TPL.about  + footer, data);
    return data;
}

function volumeHTML(data, header, footer) {
    let stories;

    stories = fs.readFileSync(`../../data/${data.children.content_path}`,
                               {encoding: 'utf-8'});
    stories = JSON.parse(stories);

    stories = stories.map(function(story){
        story.parent = data.slug;
        story.slug = story.title.toLowerCase().replace(/\s+/, '-');
        story.content = story.content.replace(/\n+/, '\n').split('\n');
        story.content = story.content.filter(function(p) { return p; });
        story.html = mustache.render(header + TPL.story + footer, story);
        return story;
    });

    data.children = stories;
    data.html = mustache.render(header + TPL.volume  + footer, data);

    return data;
}

function indexHTML(data, header, footer) {
    data.html = mustache.render(header + TPL.index  + footer, data);
    return data;
}

function generateHTML(site) {
    let pages, header, footer;

    header = mustache.render(TPL.header, site);
    footer = mustache.render(TPL.footer);

    pages = site.pages.map(function(page){
        switch (page.template) {
            case 'index':
                return indexHTML(page, header, footer);
                break;
            case 'volume':
                return volumeHTML(page, header, footer);
                break;
            default:
                return pageHTML(page, header, footer);
                break;
        }
    });

    let counter = 0;
    pages.forEach(function(page) {
        if (page === null) {
            return;
        }

        counter += 1;
        console.log(`Generating '${page.title}' page`);

        if (page.children) {
            page.children.forEach(function(story){
                let parent = `../../public/${page.slug}`;
                if (!fs.existsSync(parent)) {
                    fs.mkdirSync(`../../public/${page.slug}`);
                }

                counter += 1;
                console.log(`Generating '${page.title}/${story.title}' page`);
                fs.writeFileSync(`${parent}/${story.slug}.html`, story.html);
            });
        }

        fs.writeFileSync(`../../public/${page.slug}.html`, page.html);
    });

    console.log(`Done! ${counter} pages generated.`);
}

function main() {
    let data = fs.readFileSync('../../data/index.json', {encoding: 'utf-8'});

    generateHTML(JSON.parse(data));
}

main();
