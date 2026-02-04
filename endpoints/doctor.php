<?php

$currDir        = dirname(__DIR__);
$rootDir        = $_SERVER['DOCUMENT_ROOT'];
require_once $rootDir . '/wp-config.php';

/**
 * The class responsible for defining all actions that occur in the admin area.
 */
require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-d2g-doc-user-profile.php';
$d2gAdmin = new D2G_doc_user_profile();

$error = '';
$user_data = json_decode(file_get_contents('php://input'), true);



$superKey           = get_option('wcc_token');
$timestamp          = new DateTime();
$hashChecker = hash('sha256', $user_data['timestamp']."_".$user_data['user_key']."_".$superKey);

if($hashChecker != $user_data['hash']){
    die('The hash is incorrect for the doctor creation request.');
}
$tariffs    = $user_data['tariffs'];




if(isset($user_data['user_email'])){
    if(!email_exists($user_data['user_email'])){

        $user           = $d2gAdmin::d2g_create_doc_user($user_data);
        $user_id        = $user;
    
        /*** check for error when creating user ***/
        if(is_wp_error($user)){
            $error = $user->errors;
            if(isset($error["existing_user_email"])){
                $error = $error["existing_user_email"][0];
            } else {
                $error = esc_html__('an unknown error has occurred', 'doctor2go-connect');
            }
        }
    
        if($error == ''){
            /*** add user meta (keys) ***/
            update_user_meta($user, 'wcc_user_id', $user_data['user_id']);
            update_user_meta($user, 'user_key', $user_data['user_key']);
            update_user_meta($user, 'organisation_key', $user_data['organisation_key']);
    
            /*** create pub. doctor profile entry ***/
            $doc_meta       = $d2gAdmin::d2g_set_doc_meta($user, $user_data);
            $doc            = $d2gAdmin::d2g_create_doc_profile($user_data, $doc_meta, $user);
            echo esc_html__('The user + public profile have been created. User ID: ', 'doctor2go-connect').esc_html($user_id);
        } else {
            //var_dump($user);
            error_log('IMPORT ERROR: ' . var_export($error, true));
            error_log('IMPORT ERROR USER: ' . var_export($user, true));
        }
    
    
    } else {
        if(isset($user_data['user_id'])){
            $args           = array(
                'post_type'     => 'd2g_doctor',
                'post_status' => 'any',
                'meta_query' => array(
                    array(
                    'key'       => 'wcc_user_id',
                    'value'     => $user_data['user_id']
                    ),
                )
            );
            
            $docs           = get_posts($args);
        
            if(count($docs) > 0){
                $docID          = $docs[0]->ID;
                $wcc_status     = get_post_meta($docID, 'wcc_status', true);

                if($user_data['organisation_state'] == 'inactive'){
                    $status = 'draft';
                    update_post_meta($docID, 'wcc_status', 'inactive');
                } elseif($user_data['organisation_state'] == 'active' && $wcc_status == 'inactive') {
                    $status = 'publish';
                    update_post_meta($docID, 'wcc_status', 'active');
                } else {
                    $status = $docs[0]->post_status;
                }
                
                $my_update = array(
                    'post_title'        => $user_data['user_full_name'],
                    'post_content'      => $docs[0]->post_content,
                    'post_status'       => $status,
                    'ID'                => $docs[0]->ID
                );
        
                wp_update_post($my_update);
        
               
                update_post_meta($docID, 'tariffs', $tariffs);
                update_post_meta($docID, 'locations_to_go', $user_data['locations']);
                update_post_meta($docID, 'd2g_first_name', $user_data['user_first_name']);
                update_post_meta($docID, 'd2g_last_name', $user_data['user_last_name']);
                update_post_meta($docID, 'd2g_main_email', $user_data['user_email']);
                echo esc_html('update was a success');
            } else {
                echo esc_html('user does not excist');
            }
            
            
        } else {
            echo esc_html('no user id has been send');
        }
    }
}