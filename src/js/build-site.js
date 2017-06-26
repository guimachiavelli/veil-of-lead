/* jshint node: true */

'use strict';

let fs = require('fs'),
    marked = require('marked'),
    mustache = require('mustache');

const TPL = {
    page: fs.readFileSync('./templates/page.html', {encoding: 'utf-8'}),
    story: fs.readFileSync('./templates/story.html', {encoding: 'utf-8'}),
    volume: fs.readFileSync('./templates/volume.html', {encoding: 'utf-8'}),
    header: fs.readFileSync('./templates/header.html', {encoding: 'utf-8'}),
    footer: fs.readFileSync('./templates/footer.html', {encoding: 'utf-8'})
};

function pageHTML(data) {
    data.content = marked(data.content);
    data.html = mustache.render(TPL.page, data);
    return data;
}

function volumeHTML(data) {
    let stories;

    stories = fs.readFileSync(`../../data/${data.children.content_path}`,
                               {encoding: 'utf-8'});
    stories = JSON.parse(stories);

    stories = stories.map(function(story){
        story.parent = data.slug;
        story.slug = story.title.toLowerCase().replace(/\s+/, '-');
        story.content = marked(story.content);
        story.html = mustache.render(TPL.story, story);
        return story;
    });

    data.children = stories;
    data.html = mustache.render(TPL.volume, data);

    return data;
}

function generateHTML(site) {
    let pages;

    pages = site.pages.map(function(page){
        switch (page.template) {
            case 'volume':
                return volumeHTML(page);
                break;
            default:
                return pageHTML(page);
                break;
        }
    });

    let counter = 0;
    pages.forEach(function(page) {
        let headerData, header, footer;

        if (page === null) {
            return;
        }

        headerData = {
            title: `${page.title} — ${site.title}`,
            heading: site.title,
            pages: site.pages
        };

        if (page.template === 'index') {
            headerData.title = site.title;
        }

        counter += 1;
        console.log(`Generating '${page.title}' page`);

        if (page.children) {
            page.children.forEach(function(story){
                let parent, headerData, description;

                parent = `../../public/${page.slug}`;

                if (!fs.existsSync(parent)) {
                    fs.mkdirSync(`../../public/${page.slug}`);
                }

                counter += 1;

                headerData = {
                    title: `${story.title} — ${site.title}`,
                    heading: site.title,
                    pages: site.pages
                };

                console.log(headerData.description);

                header = mustache.render(TPL.header, headerData);
                footer = mustache.render(TPL.footer);
                story.html = header + story.html + footer;

                console.log(`Generating '${page.title}/${story.title}' page`);
                fs.writeFileSync(`${parent}/${story.slug}.html`, story.html);
            });
        }

        header = mustache.render(TPL.header, headerData);
        footer = mustache.render(TPL.footer);
        page.html = header + page.html + footer;

        fs.writeFileSync(`../../public/${page.slug}.html`, page.html);
    });

    console.log(`Done! ${counter} pages generated.`);
}

function main() {
    let data = fs.readFileSync('../../data/index.json', {encoding: 'utf-8'});

    generateHTML(JSON.parse(data));
}

main();
