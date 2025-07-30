import { test, expect } from '@playwright/test';

test.describe('Spec 2: Dark Theme Site Header', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('header-display: see dark themed header with author name, navigation links (Blog, About, Contact), and professional styling', async ({ page, isMobile }) => {
    // Check that the header is visible with dark theme
    const header = page.getByTestId('site-header');
    await expect(header).toBeVisible();
    
    // Verify dark theme styling
    await expect(header).toHaveClass(/bg-dark-surface/);
    await expect(header).toHaveClass(/border-dark-border/);
    
    // Check author name is displayed
    const authorName = page.getByTestId('author-name');
    await expect(authorName).toBeVisible();
    await expect(authorName).toContainText('Dane Griggs');
    
    if (!isMobile) {
      // Check desktop navigation links are visible on desktop
      const desktopNav = page.getByTestId('desktop-navigation');
      await expect(desktopNav).toBeVisible();
      
      const blogLink = page.getByTestId('blog-link');
      const aboutLink = page.getByTestId('about-link');
      const contactLink = page.getByTestId('contact-link');
      
      await expect(blogLink).toBeVisible();
      await expect(blogLink).toContainText('Blog');
      
      await expect(aboutLink).toBeVisible();
      await expect(aboutLink).toContainText('About');
      
      await expect(contactLink).toBeVisible();
      await expect(contactLink).toContainText('Contact');
      
      // Verify professional styling - links should have proper colors
      await expect(blogLink).toHaveClass(/text-dark-text/);
      await expect(aboutLink).toHaveClass(/text-dark-text/);
      await expect(contactLink).toHaveClass(/text-dark-text/);
    } else {
      // On mobile, check that desktop nav is hidden and mobile menu button is visible
      const desktopNav = page.getByTestId('desktop-navigation');
      await expect(desktopNav).toHaveClass(/hidden/);
      
      const mobileMenuButton = page.getByTestId('mobile-menu-button');
      await expect(mobileMenuButton).toBeVisible();
    }
  });

  test('responsive-header: header adapts to mobile with hamburger menu and proper spacing', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that desktop navigation is hidden on mobile
    const desktopNav = page.getByTestId('desktop-navigation');
    await expect(desktopNav).toHaveClass(/hidden/);
    
    // Check that mobile menu button is visible
    const mobileMenuButton = page.getByTestId('mobile-menu-button');
    await expect(mobileMenuButton).toBeVisible();
    
    // Check that mobile menu is initially hidden
    const mobileMenu = page.getByTestId('mobile-menu');
    await expect(mobileMenu).toHaveClass(/hidden/);
    
    // Click hamburger button to open menu
    await mobileMenuButton.click();
    
    // Check that mobile menu is now visible
    await expect(mobileMenu).not.toHaveClass(/hidden/);
    
    // Check that mobile navigation links are visible
    const mobileBlogLink = page.getByTestId('mobile-blog-link');
    const mobileAboutLink = page.getByTestId('mobile-about-link');
    const mobileContactLink = page.getByTestId('mobile-contact-link');
    
    await expect(mobileBlogLink).toBeVisible();
    await expect(mobileBlogLink).toContainText('Blog');
    
    await expect(mobileAboutLink).toBeVisible();
    await expect(mobileAboutLink).toContainText('About');
    
    await expect(mobileContactLink).toBeVisible();
    await expect(mobileContactLink).toContainText('Contact');
    
    // Verify proper spacing and dark theme styling
    await expect(mobileMenu).toHaveClass(/bg-dark-surface/);
    await expect(mobileMenu).toHaveClass(/border-dark-border/);
    
    // Click hamburger button again to close menu
    await mobileMenuButton.click();
    
    // Check that mobile menu is hidden again
    await expect(mobileMenu).toHaveClass(/hidden/);
  });
});