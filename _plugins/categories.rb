module Jekyll

    class CategoryIndex < Page
        def initialize(site, base, dir, category)
            @site = site
            @base = base
            @dir = dir
            @name = 'index.html'

            self.process(@name)
            self.read_yaml(File.join(base, '_layouts'), 'category.html')
            self.data['category'] = category
            self.data['title'] = category.gsub('-', ' ').split(' ').map {|w| w.capitalize }.join(' ').gsub('And', 'and').gsub('On', 'on')
        end
    end

    class CategoryGenerator < Generator
        safe true

        def generate(site)
            if site.layouts.key? 'category'
                site.categories.keys.each do |category|
                    write_category_index(site, File.join(category), category)
                end
            end
        end

        def paginate(site, page)
            # sort categories by descending date of publish
            category_posts = site.categories[page.data['category']].sort_by { |p| -p.date.to_f }

            # calculate total number of pages
            pages = CategoryPager.calculate_pages(category_posts, site.config['paginate'].to_i)

            # iterate over the total number of pages and create a physical page for each
            (1..pages).each do |num_page|
                # the CategoryPager handles the paging and category data
                pager = CategoryPager.new(site.config, num_page, category_posts, page.data['category'], pages)

                # the first page is the index, so no page needs to be created. However, the subsequent pages need to be generated
                if num_page > 1
                    newpage = CategorySubPage.new(site, site.source, page.data['category'], page.data['category_layout'])
                    newpage.pager = pager
                    newpage.dir = File.join(page.dir, "/#{page.data['category']}/page#{num_page}")
                    site.pages << newpage
                else
                    page.pager = pager
                    newpage = CategorySubPage.new(site, site.source, page.data['category'], page.data['category_layout'])
                    newpage.pager = pager
                    newpage.dir = File.join(page.dir, "/#{page.data['category']}")
                    site.pages << newpage
                end
            end
        end

        def write_category_index(site, dir, category)
            index = CategoryIndex.new(site, site.source, dir, category)
            index.render(site.layouts, site.site_payload)
            index.write(site.dest)
            site.pages << index
            paginate(site, index)
        end
    end

    class CategorySubPage < Page
        def initialize(site, base, category, layout)
            @site = site
            @base = base
            @dir  = category
            @name = 'index.html'

            self.process(@name)
            self.read_yaml(File.join(base, '_layouts'), layout || 'category.html')

            self.data['title'] = category.gsub('-', ' ').split(' ').map {|w| w.capitalize }.join(' ').gsub('And', 'and').gsub('On', 'on')
        end
    end

    class CategoryPager < Pager
        attr_reader :category

        def self.pagination_enabled?(config, page)
            page.name == 'index.html' && page.data.key?('category') && !config['paginate'].nil?
        end

        # same as the base class, but includes the category value
        def initialize(config, page, all_posts, category, num_pages = nil)
            @category = category
            super config, page, all_posts, num_pages
        end

        # use the original to_liquid method, but add in category info
        alias_method :original_to_liquid, :to_liquid
        def to_liquid
            x = original_to_liquid
            x['category'] = @category
            x
        end
    end

    class SortedCategoriesBuilder < Generator
        safe true
        priority :high

        def generate(site)
            site.config['sorted_categories'] = site.categories.sort
        end
    end

end