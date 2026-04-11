import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { ProductService } from '../../../../services/product.service';
import { ToastrService } from "ngx-toastr";
import { Article, InsertArticle, UpdateArticle } from '../../../../models/article';
import { ArticleService } from '../../../../services/article.service';

@Component({
    selector: 'app-insert.article.admin',
    templateUrl: './insert.article.admin.component.html',
    styleUrls: ['./insert.article.admin.component.css'],

})
export class InsertArticleAdminComponent implements OnInit {
    insertArticle: InsertArticle = {
        author: '',
        title: '',
        description: '',
        thumbnail: '',
    };
    articles: Article[] = [];
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private articleService: ArticleService,
        private productService: ProductService,
        private toastr: ToastrService
    ) {

    }
    ngOnInit() {

    }



    insertNewArticle(): void {
        this.articleService.insertArticle(this.insertArticle).subscribe({
            next: (response: any) => {
                this.toastr.success('Bài viết được thêm thành công', 'Thành công', {
                    timeOut: 2000
                });               
                this.router.navigate(['/admin/articles']);
            },
            error: (error: any) => {
                this.toastr.error('Đã xảy ra lỗi khi thêm bài viết', 'Lỗi', {
                    timeOut: 2000
                });
                console.error('Error inserting article:', error);
            }
        });
    }

    resetForm(): void {
        this.insertArticle = {
            author: '',
            title: '',
            description: '',
            thumbnail: '',
        };
    }



}
