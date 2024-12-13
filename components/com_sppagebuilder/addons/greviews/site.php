<?php

/**
 * @package SP Page Builder
 * @subpackage Google Reviews Addon
 * @author 
 * @copyright 2023
 * @license GNU/GPLv2 or later
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\Version;
use Joomla\CMS\Language\Text;

class SppagebuilderAddonGreviews extends SppagebuilderAddons
{
    public function render()
    {
        $settings = $this->addon->settings;

        // Addon settings
        $place_id = $settings->place_id ?? '';
        $display_mode = $settings->display_mode ?? 'GRID';
        $maxlength = $settings->maxlength ?? 250;

        // Generate unique ID for the addon
        $addon_id = 'sppb-addon-greviews-' . $this->addon->id;

        // Base output structure
        $output = '<div id="' . $addon_id . '" class="sppb-addon sppb-addon-greviews">';

        if ($place_id) {
            $output .= '<div class="sppb-addon-content">';
            $output .= '<div class="google-reviews-container d-flex justify-content-center align-items-center" data-place-id="' . htmlspecialchars($place_id) . '" data-display-mode="' . htmlspecialchars($display_mode) . '" data-maxlength="' . htmlspecialchars($maxlength) . '">';
            $output .= '<div class="loading-spinner"></div>';
            $output .= '</div>';
            $output .= '</div>';
        } else {
            $output .= '<p class="alert alert-warning">' . Text::_('COM_SPPAGEBUILDER_ADDON_GREVIEWS_NO_PLACE_ID') . '</p>';
        }

        $output .= '</div>';

        return $output;
    }

    public function scripts()
    {
        $params = ComponentHelper::getParams('com_sppagebuilder');
        $gmap_api = $params->get('gmap_api', '');

        $version = new Version();
        $JoomlaVersion = (float) $version->getShortVersion();

        if ($JoomlaVersion > 4) {
            Factory::getDocument()->getWebAssetManager()->registerAndUseScript('gmap-api', "https://maps.googleapis.com/maps/api/js?key=" . $gmap_api . '&loading=async&libraries=places', [], []);
        } else {
            HTMLHelper::_('script', "https://maps.googleapis.com/maps/api/js?key=" . $gmap_api . '&libraries=places', [], []);
        }

        return [
            Uri::base(true) . "/components/com_sppagebuilder/assets/js/greviews.js"
        ];
    }

    public function css()
    {
        $addon_id = '#sppb-addon-' . $this->addon->id;
        $cssHelper = new CSSHelper($addon_id);
        $settings = $this->addon->settings;

        $css = '';

        $css .= $cssHelper->generateStyle('.google-reviews-container', $settings, ['height' => 'height'], ['height' => 'px']);

        return $css;
    }

    public static function getTemplate()
    {
        $lodash = new Lodash('#sppb-addon-{{ data.id }}');
        $output = '
            <div id="sppb-addon-{{ data.id }}" class="sppb-addon sppb-addon-greviews">
                <div class="sppb-addon-content">
                    <div class="google-reviews-container" data-place-id="{{ data.place_id }}" data-display-mode="{{ data.display_mode }}" data-maxlength="{{ data.maxlength }}">
                        <div class="loading-spinner"></div>
                    </div>
                </div>
            </div>';

        return $output;
    }
}
