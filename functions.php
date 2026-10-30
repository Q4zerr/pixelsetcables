<?php

/**
 * Pixels-&-Cables functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package Pixels-&-Cables
 * @since 1.0.0
 */

/**
 * Define Constants
 */
define('THEME_NAME', "Pixels-&-Cables");
define('THEME_VERSION', '1.0.0');

// include_once('php_includes/file.php');

/**
 * Returns a cache-busting version based on file modification time.
 */
function pixelsetcables_template_asset_version($file_path)
{
    return file_exists($file_path) ? filemtime($file_path) : THEME_VERSION;
}

/**
 * Enqueue a CSS file generated in /assets/dist/css/.
 */
function pixelsetcables_template_enqueue_dist_style($handle, $filename, $dependencies = array('bundle-css'))
{
    $theme_dist_uri  = get_stylesheet_directory_uri() . '/assets/dist';
    $theme_dist_path = get_stylesheet_directory() . '/assets/dist';

    $file_path = $theme_dist_path . '/css/' . $filename . '.css';

    if (!file_exists($file_path)) {
        return false;
    }

    wp_enqueue_style(
        $handle,
        $theme_dist_uri . '/css/' . $filename . '.css',
        $dependencies,
        pixelsetcables_template_asset_version($file_path),
        'all'
    );

    return true;
}

/**
 * Enqueue a JS file generated in /assets/dist/js/.
 * Useful if we have specific page script like home.js etc
 */
function pixelsetcables_template_enqueue_dist_script($handle, $filename, $dependencies = array())
{
    $theme_dist_uri  = get_stylesheet_directory_uri() . '/assets/dist';
    $theme_dist_path = get_stylesheet_directory() . '/assets/dist';

    $file_path = $theme_dist_path . '/js/' . $filename . '.js';

    if (!file_exists($file_path)) {
        return;
    }

    wp_enqueue_script(
        $handle,
        $theme_dist_uri . '/js/' . $filename . '.js',
        $dependencies,
        pixelsetcables_template_asset_version($file_path),
        array(
        'in_footer' => true,
        'strategy'  => 'defer',
    )
    );
}

/**
 * Check if current page is the given page or one of its descendants.
 *
 * Exemple :
 * pixelsetcables_is_page_or_descendant_of('nos-metiers')
 */
function pixelsetcables_is_page_or_descendant_of($page_slug)
{
    if (!is_page()) {
        return false;
    }

    $page = get_queried_object();

    if (!$page instanceof WP_Post || $page->post_type !== 'page') {
        return false;
    }

    $page_slug = sanitize_title($page_slug);

    if (sanitize_title($page->post_name) === $page_slug) {
        return true;
    }

    $ancestors = get_post_ancestors($page->ID);

    if (empty($ancestors)) {
        return false;
    }

    foreach ($ancestors as $ancestor_id) {
        $ancestor = get_post((int) $ancestor_id);

        if ($ancestor instanceof WP_Post && sanitize_title($ancestor->post_name) === $page_slug) {
            return true;
        }
    }

    return false;
}

/**
 * Enqueues
 */

function child_enqueue()
{
    $theme_dist_uri  = get_stylesheet_directory_uri() . '/assets/dist';
    $theme_dist_path = get_stylesheet_directory() . '/assets/dist';

    /**
     * Global CSS
     */
    wp_enqueue_style(
        'bundle-css',
        $theme_dist_uri . '/css/bundle.css',
        array(),
        pixelsetcables_template_asset_version($theme_dist_path . '/css/bundle.css'),
        'all'
    );

    /**
     * Global JS
     */
    wp_enqueue_script(
        'bundle-script',
        $theme_dist_uri . '/js/bundle.js',
        array(),
        pixelsetcables_template_asset_version($theme_dist_path . '/js/bundle.js'),
        array(
        'in_footer' => true,
        'strategy'  => 'defer',
    )
    );

    /**
     * Front page CSS
     */
    if (is_front_page()) {
        pixelsetcables_template_enqueue_dist_style('accueil-css', 'accueil');
    }

    /**
     * Search page CSS
     */
    // if (is_search()) {
    //   pixelsetcables_template_enqueue_dist_style('search-css', 'search');
    // }

    /**
     * Template / legal pages CSS
     */
    // if (is_page(array('mentions-legales', 'politique-de-confidentialite'))) {
    //   pixelsetcables_template_enqueue_dist_style('template-css', 'template');
    // }

    /**
     * Section "Nos mÃ©tiers" CSS
     * Charge le CSS sur la page nos-metiers + toutes ses pages enfants.
     */
    // if (pixelsetcables_is_page_or_descendant_of('nos-metiers')) {
    //   pixelsetcables_template_enqueue_dist_style('nos-metiers-css', 'nos-metiers');
    // }
}
add_action('wp_enqueue_scripts', 'child_enqueue', 15);

// Used to show list of all categories
function pixelsetcables_template_posts_categories()
{
    $list = wp_list_categories(array(
      'taxonomy'   => 'category',
      'echo'       => '',
      'title_li'   => '',
    ));
    return "<ul class='pixelsetcables_template_posts_categories'>$list</ul>";
}
add_shortcode('pixelsetcables_template_posts_categories', 'pixelsetcables_template_posts_categories');

// SVG support
function pixelsetcables_template_mime_types($mimes)
{
    if (!current_user_can('manage_options')) {
        return $mimes;
    }

    $mimes['svg'] = 'image/svg+xml';

    return $mimes;
}
add_filter('upload_mimes', 'pixelsetcables_template_mime_types');


/**
 * Page hierarchy helpers.
 *
 * Objectif : exposer dans <body> des classes fiables pour cibler :
 * - la page courante par slug ;
 * - les pages enfants ;
 * - le parent direct ;
 * - tous les ancÃªtres ;
 * - la section racine.
 */
function pixelsetcables_template_page_has_children($page_id)
{
    $children = get_posts([
      'post_type'      => 'page',
      'post_status'    => 'publish',
      'post_parent'    => (int) $page_id,
      'posts_per_page' => 1,
      'fields'         => 'ids',
      'no_found_rows'  => true,
    ]);

    return !empty($children);
}

function pixelsetcables_template_add_page_body_classes($classes)
{
    if (!is_page()) {
        return $classes;
    }

    $page = get_queried_object();

    if (!$page instanceof WP_Post || $page->post_type !== 'page') {
        return $classes;
    }

    $page_slug = sanitize_html_class($page->post_name);
    $ancestors = get_post_ancestors($page->ID);
    $depth = count($ancestors);

    /**
     * CompatibilitÃ© avec l'ancien comportement.
     * Exemple : page-contact, page-nos-metiers, etc.
     */
    $classes[] = 'page-' . $page_slug;

    /**
     * Variante plus explicite, utile pour Ã©viter les ambiguÃ¯tÃ©s CSS/JS.
     * Exemple : page-slug-contact.
     */
    $classes[] = 'page-slug-' . $page_slug;
    $classes[] = 'page-depth-' . $depth;

    if (pixelsetcables_template_page_has_children($page->ID)) {
        $classes[] = 'has-child-pages';
    }

    if (empty($ancestors)) {
        $classes[] = 'is-root-page';
        return array_values(array_unique(array_filter($classes)));
    }

    $classes[] = 'is-child-page';

    /**
     * Parent direct uniquement.
     * Exemple : is-direct-child-of-nos-metiers.
     */
    $direct_parent = get_post((int) $page->post_parent);

    if ($direct_parent instanceof WP_Post) {
        $direct_parent_slug = sanitize_html_class($direct_parent->post_name);
        $classes[] = 'is-direct-child-of-' . $direct_parent_slug;
        $classes[] = 'page-parent-' . $direct_parent_slug;
    }

    /**
     * Tous les ancÃªtres de la page.
     * Exemple : is-child-of-nos-metiers si la page est Ã  n'importe quel niveau sous "Nos mÃ©tiers".
     */
    foreach ($ancestors as $ancestor_id) {
        $ancestor = get_post((int) $ancestor_id);

        if (!$ancestor instanceof WP_Post) {
            continue;
        }

        $ancestor_slug = sanitize_html_class($ancestor->post_name);
        $classes[] = 'is-child-of-' . $ancestor_slug;
        $classes[] = 'page-ancestor-' . $ancestor_slug;
    }

    /**
     * AncÃªtre racine de la section.
     * Exemple : is-in-section-nos-metiers.
     */
    $root_ancestor_id = (int) $ancestors[$depth - 1];
    $root_ancestor = get_post($root_ancestor_id);

    if ($root_ancestor instanceof WP_Post) {
        $root_ancestor_slug = sanitize_html_class($root_ancestor->post_name);
        $classes[] = 'is-in-section-' . $root_ancestor_slug;
        $classes[] = 'page-root-' . $root_ancestor_slug;
    }

    return array_values(array_unique(array_filter($classes)));
}
add_filter('body_class', 'pixelsetcables_template_add_page_body_classes');
